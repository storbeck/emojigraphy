const Jimp = require('jimp');
const yargs = require('yargs');

// Define command-line options
const argv = yargs
  .command('encode', 'Encode a message in an image', (yargs) => {
    yargs
      .option('sourceImagePath', {
        description: 'Path to the source image',
        demandOption: true,
        type: 'string',
      })
      .option('message', {
        description: 'Message to encode',
        demandOption: true,
        type: 'string',
      })
      .option('outputImagePath', {
        description: 'Path to the output image with the hidden message',
        demandOption: true,
        type: 'string',
      });
  })
  .command('decode', 'Decode a message from an image', (yargs) => {
    yargs
      .option('imagePath', {
        description: 'Path to the image with the hidden message',
        demandOption: true,
        type: 'string',
      });
  })
  .demandCommand(1, 'You must provide a valid command.')
  .help().argv;

async function hideMessageInImage(sourceImagePath, message, outputImagePath) {
  const image = await Jimp.read(sourceImagePath);

  // Encode the length of the message as 16 bits (adjust as needed)
  const messageLength = message.length;
  const messageBinaryLength = messageLength.toString(2).padStart(16, '0');
  const messageBinary = toBinary(message);

  let index = 0;

  // Encode the message length in the first pixels
  for (let i = 0; i < 16; i++) {
    const pixel = Jimp.intToRGBA(image.getPixelColor(i % image.bitmap.width, Math.floor(i / image.bitmap.width)));
    pixel.r = (pixel.r & ~1) | parseInt(messageBinaryLength[i], 2);
    image.setPixelColor(Jimp.rgbaToInt(pixel.r, pixel.g, pixel.b, pixel.a), i % image.bitmap.width, Math.floor(i / image.bitmap.width));
  }

  // Encode the message in the remaining pixels
  image.scan(16, 0, image.bitmap.width - 16, image.bitmap.height, function (x, y, idx) {
    if (index < messageBinary.length) {
      const pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
      pixel.r = (pixel.r & ~1) | parseInt(messageBinary[index++], 2);
      image.setPixelColor(Jimp.rgbaToInt(pixel.r, pixel.g, pixel.b, pixel.a), x, y);
    }
  });

  await image.writeAsync(outputImagePath);
  console.log('Message hidden in image!');
}

function toBinary(text) {
  return text
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
}

async function extractMessageFromImage(imagePath) {
  const image = await Jimp.read(imagePath);
  let binaryMessageLength = '';

  // Extract the message length from the first 16 pixels
  for (let i = 0; i < 16; i++) {
    const pixel = Jimp.intToRGBA(image.getPixelColor(i % image.bitmap.width, Math.floor(i / image.bitmap.width)));
    binaryMessageLength += (pixel.r & 1).toString();
  }

  // Convert the binary message length to decimal
  const messageLength = parseInt(binaryMessageLength, 2);

  let binaryMessage = '';
  let currentByte = '';

  // Extract the message from the remaining pixels
  image.scan(16, 0, image.bitmap.width - 16, image.bitmap.height, function (x, y, idx) {
    if (binaryMessage.length < messageLength * 8) {
      const pixel = Jimp.intToRGBA(image.getPixelColor(x, y));
      currentByte += (pixel.r & 1).toString();
    }

    if (currentByte.length === 8) {
      binaryMessage += currentByte;
      currentByte = '';
    }
  });

  // Convert binary message to text
  const extractedMessage = binaryToText(binaryMessage);

  return extractedMessage;
}

function binaryToText(binary) {
  let text = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    text += String.fromCharCode(parseInt(byte, 2));
  }
  return text;
}

// Handle command-line arguments
if (argv._[0] === 'encode') {
  hideMessageInImage(argv.sourceImagePath, argv.message, argv.outputImagePath)
    .catch((err) => console.error(err));
} else if (argv._[0] === 'decode') {
  extractMessageFromImage(argv.imagePath)
    .then((extractedMessage) => console.log('Extracted message:', extractedMessage))
    .catch((err) => console.error(err));
} else {
  console.error('Invalid command. Use "encode" or "decode".');
  yargs.showHelp();
}
