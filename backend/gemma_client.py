"""
Gemma 4 client — streams responses from Google AI Studio API.
Built by Rudrani Ghosh · lawreformer.com
"""

import os
from typing import AsyncGenerator
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMMA_API_KEY = os.getenv("GEMMA_API_KEY", "")
MODEL_NAME = os.getenv("GEMMA_MODEL", "gemma-3-27b-it")

genai.configure(api_key=GEMMA_API_KEY)


async def stream_gemma_response(
    system_prompt: str, user_message: str
) -> AsyncGenerator[str, None]:
    """Stream tokens from Gemma 4 via Google AI Studio."""
    model = genai.GenerativeModel(
        model_name=MODEL_NAME,
        system_instruction=system_prompt,
    )

    try:
        response = model.generate_content(
            user_message,
            stream=True,
            generation_config=genai.GenerationConfig(
                temperature=0.7,
                top_p=0.9,
                top_k=40,
                max_output_tokens=1024,
            ),
        )

        for chunk in response:
            if chunk.text:
                yield chunk.text

    except Exception as e:
        yield f"\n\n⚠️ Error communicating with Gemma: {str(e)}"
