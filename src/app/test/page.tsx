'use client'

export default function TestButton() {
  const handleClick = () => {
    alert('Button clicked!')
  }

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <button
        onClick={handleClick}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: 'black',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Test Click
      </button>
    </div>
  )
}
