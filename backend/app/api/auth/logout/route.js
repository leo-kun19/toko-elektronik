export async function POST() {
  try {
    console.log('✅ Logout successful');
    
    return Response.json(
      {
        success: true,
        message: 'Logout berhasil'
      },
      {
        status: 200
      }
    );
  } catch (error) {
    console.error('❌ Logout error:', error);
    return Response.json(
      { 
        success: false,
        error: 'Logout gagal' 
      },
      { 
        status: 500
      }
    );
  }
}
