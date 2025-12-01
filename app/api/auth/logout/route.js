import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Buat response sukses
    const response = NextResponse.json({
      success: true,
      message: 'Logout berhasil'
    })

    // Hapus token dari cookies
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Langsung expired
      path: '/'
    })

    console.log('✅ Logout successful - token cleared')
    return response

  } catch (error) {
    console.error('❌ Logout error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Logout gagal' 
      },
      { status: 500 }
    )
  }
}