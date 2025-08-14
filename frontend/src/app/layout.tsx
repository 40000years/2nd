import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '2nd - ของมือสองคุณภาพดี',
  description: 'เว็บไซต์ขายของมือสองที่เชื่อถือได้ ปลอดภัย และมีคุณภาพ',
  keywords: 'ของมือสอง, second hand, ขายของ, ซื้อของ, ของใช้, อิเล็กทรอนิกส์, แฟชั่น, บ้าน, กีฬา',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
