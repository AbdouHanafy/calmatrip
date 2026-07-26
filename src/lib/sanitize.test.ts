import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "./sanitize";

describe("sanitizeHtml", () => {
  it("strips <script> tags", () => {
    const result = sanitizeHtml("<p>Hello</p><script>alert(1)</script>");
    expect(result).not.toContain("<script>");
    expect(result).toContain("<p>Hello</p>");
  });

  it("strips inline event handler attributes", () => {
    const result = sanitizeHtml('<img src="x" onerror="alert(1)">');
    expect(result).not.toContain("onerror");
  });

  it("strips javascript: URLs in href", () => {
    const result = sanitizeHtml('<a href="javascript:alert(1)">click</a>');
    expect(result.toLowerCase()).not.toContain("javascript:");
  });

  it("keeps allowed formatting tags intact", () => {
    const result = sanitizeHtml("<p>Some <strong>bold</strong> and <em>italic</em> text.</p>");
    expect(result).toContain("<strong>bold</strong>");
    expect(result).toContain("<em>italic</em>");
  });

  it("keeps allowed list tags intact", () => {
    const result = sanitizeHtml("<ul><li>One</li><li>Two</li></ul>");
    expect(result).toBe("<ul><li>One</li><li>Two</li></ul>");
  });

  it("drops disallowed tags like <iframe>", () => {
    const result = sanitizeHtml('<iframe src="https://evil.example"></iframe><p>text</p>');
    expect(result).not.toContain("<iframe");
    expect(result).toContain("<p>text</p>");
  });
});
