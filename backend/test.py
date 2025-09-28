# To run this code you need to install the following dependencies:
# pip install google-genai

from google import genai
from dotenv import load_dotenv
import os

load_dotenv()
def generate():
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    client = genai.Client(api_key=gemini_api_key)
    test ="Make a cartoon image of the following scenerio and make the speaker a young college student. Make the entire vibe of the picture cheerful. Today, I saw an elderly woman struggling to carry her groceries across the street. Without thinking twice, I rushed over and offered to help. We laughed a little as I balanced her bags, and she thanked me warmly. It felt good to make her day easier. It reminded me that small acts of kindness can really brighten someone’s world — and mine too."
    result = client.models.generate_images(
        model="models/imagen-3.0-generate-002",
        prompt=f'{test}',
        config=dict(
            number_of_images=1,
            output_mime_type="image/jpeg",
            aspect_ratio="1:1",
        ),
    )

    if not result.generated_images:
        print("No images generated.")
        return

    if len(result.generated_images) != 1:
        print("Number of images generated does not match the requested number.")

    for n, generated_image in enumerate(result.generated_images):
        generated_image.image.save(f"./test/generated_image_{n}.jpg")


if __name__ == "__main__":
    generate()
