export async function revalidatePublicPages(path?: string) {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
  } catch {
    // Silently fail — pages will still update within 60s via ISR
  }
}
