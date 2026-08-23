def truncate_description(text, length=100):
    """Truncates a string to a specific length and adds ellipsis."""
    if not text:
        return ""
    if len(text) <= length:
        return text
    return text[:length].rsplit(' ', 1)[0] + '...'

def slugify_title(title):
    """Converts a title into a URL-friendly slug."""
    import re
    title = title.lower()
    title = re.sub(r'[^a-z0-9\s-]', '', title)
    title = re.sub(r'[\s-]+', '-', title).strip('-')
    return title
