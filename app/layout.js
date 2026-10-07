export const metadata = { title: 'Fullstack To-Do App' };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif', margin: 0, padding: '2rem', background: '#f5f5f5' }}>
        {children}
      </body>
    </html>
  );
}