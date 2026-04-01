export const metadata = {
  title: "GDL Stone Snow LLC",
  description: "Landscaping, masonry, and snow removal services in Bloomington MN",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
