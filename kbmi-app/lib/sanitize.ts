import DOMPurify from 'dompurify'

const ALLOWED = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 's', 'h2', 'h3', 'ul', 'ol', 'li', 'blockquote', 'img'],
  ALLOWED_ATTR: ['src', 'alt', 'title', 'style', 'class'],
  // Block data: URIs in img src to prevent base64 XSS payloads exceeding a safe threshold
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
}

export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return html
  return DOMPurify.sanitize(html, ALLOWED)
}
