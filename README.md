# Emoji Storage with Text Hidden in Images

This project allows you to store text messages in images and upload them to Discord as emojis for cloud storage. You can encode a message in an image, and later, decode and retrieve the hidden message from the image.

<img width="1401" alt="Screenshot 2024-01-11 at 7 01 33 AM" src="https://github.com/storbeck/emojigraphy/assets/449874/32cc66cb-dd1a-48fc-9ea1-e84c3fc1d895">


## Prerequisites

Before you begin, ensure you have the following prerequisites installed on your system:

- Node.js (https://nodejs.org/)
- npm (Node Package Manager, included with Node.js)
- Discord account (for uploading emojis)

## Installation

1. Clone this repository or download the source code to your local machine.

2. Install the required Node.js packages by running the following command in the project directory:

   ```
   npm install
   ```

## Usage

### Encoding a Message

To encode a message in an image, use the following command:

```bash
node index.js encode --sourceImagePath <sourceImagePath> --message "<your message>" --outputImagePath <outputImagePath>
```

- `<sourceImagePath>`: Path to the source image.
- `<your message>`: The message you want to hide in the image, enclosed in double quotes.
- `<outputImagePath>`: Path to the output image with the hidden message.

Example:

```bash
node index.js encode --sourceImagePath images/in/facepalm.png --message "Hello, this is a hidden message!" --outputImagePath images/out/encoded_facepalm.png
```

### Decoding a Message

To decode a message from an encoded image, follow these steps:

1. Open Discord and go to the server where the encoded emoji is located.

2. Click on the emoji to open it in a preview window.

3. Right-click on the image in the preview window and choose "Copy Image Address." The copied URL should resemble this format: "https://cdn.discordapp.com/emojis/EMOJI_ID.webp" (Replace EMOJI_ID with the actual emoji ID). To ensure compatibility with the decoding process, rename the file extension from .webp to .png after copying the URL and remove any additional parameters.

4. Use `curl` or your preferred method to download the image to your local machine:

   ```bash
   curl -O https://cdn.discordapp.com/emojis/EMOJI_ID.png
   ```

5. Run the following command to decode the hidden message from the downloaded image:

   ```bash
   node index.js decode --imagePath EMOJI_ID.png
   ```

   The decoded message will be displayed in the terminal.

Example:

```bash
curl -O https://cdn.discordapp.com/emojis/1194975403266297865.png
node index.js decode --imagePath 1194975403266297865.png
```

The decoded message will be shown in the terminal.

### Uploading Emojis to Discord

Once you have encoded an image with a hidden message, you can upload it to Discord as an emoji for cloud storage. Follow these steps:

1. Open Discord and go to the server where you want to upload the emoji.

2. Click the server settings (the gear icon) on the bottom left.

3. Under the "User Settings" section, click on "Emoji."

4. Click the "Upload Emoji" button.

5. Select the encoded image (with the hidden message) and provide a name for the emoji.

6. Click the "Save" button to upload the emoji.

Now, you can use the uploaded emoji with the hidden message in your Discord server.

## Troubleshooting

- If you encounter any issues or errors while running the code, make sure you have followed the installation steps and provided the correct command-line arguments.

- Ensure that you have the necessary permissions to upload emojis to your Discord server.

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.
