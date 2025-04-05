from PIL import Image, ImageDraw, ImageFont
import os

# Directory to save icons
icons_dir = "icons"
if not os.path.exists(icons_dir):
    os.makedirs(icons_dir)

# Icon details (size, filename)
icon_specs = [
    (16, "icon16.png"),
    (48, "icon48.png"),
    (128, "icon128.png"),
]

# Basic appearance (Green square with a white 'W')
bg_color = (37, 211, 102) # WhatsApp green-ish
text_color = (255, 255, 255) # White

print("Generating icons...")

for size, filename in icon_specs:
    img = Image.new('RGB', (size, size), color=bg_color)
    d = ImageDraw.Draw(img)

    # Try to add a 'W' - requires a font file or uses default
    try:
        # Calculate font size (approximate)
        font_size = int(size * 0.7)
        # Try loading a default font (might vary by system)
        # If this fails, Pillow might use a very basic default bitmap font
        try:
             # Common paths for default fonts on Linux - adjust if needed
            font_path = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
            if not os.path.exists(font_path):
                 font_path = "/usr/share/fonts/liberation/LiberationSans-Bold.ttf" # Another common one
            if os.path.exists(font_path):
                font = ImageFont.truetype(font_path, font_size)
            else:
                # Fallback if specific fonts not found - may use PIL default
                 print(f"Warning: Default font file not found. Using PIL default font for {filename}.")
                 font = ImageFont.load_default() # Very basic font
        except IOError:
             print(f"Warning: Could not load any font. Using PIL default font for {filename}.")
             font = ImageFont.load_default() # Very basic font


        # Calculate text position (centered)
        # Note: textbbox might be Pillow >= 9.0.0. Use textsize for older versions.
        if hasattr(d, 'textbbox'):
             bbox = d.textbbox((0, 0), "W", font=font)
             text_width = bbox[2] - bbox[0]
             text_height = bbox[3] - bbox[1]
             text_x = (size - text_width) / 2
             text_y = (size - text_height) / 2 - (bbox[1] * 1.5) # Adjust vertical centering slightly
        else: # Fallback for older Pillow versions
             text_width, text_height = d.textsize("W", font=font)
             text_x = (size - text_width) / 2
             text_y = (size - text_height) / 2


        d.text((text_x, text_y), "W", fill=text_color, font=font)

    except Exception as e:
        print(f"Could not draw text on {filename}: {e}. Icon will be solid color.")

    # Save the image
    filepath = os.path.join(icons_dir, filename)
    img.save(filepath, "PNG")
    print(f"Saved {filepath} ({size}x{size})")

print("Icon generation complete.")
