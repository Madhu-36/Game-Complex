from django.test import TestCase
from store.utils.formatters import truncate_description, slugify_title

class FormattersTest(TestCase):
    def test_truncate_description(self):
        self.assertEqual(truncate_description("Short text"), "Short text")
        self.assertEqual(truncate_description("A very long description that needs to be truncated", 15), "A very long...")
        
    def test_slugify_title(self):
        self.assertEqual(slugify_title("The Witcher 3: Wild Hunt!"), "the-witcher-3-wild-hunt")
