import { useEffect, useState } from "react"

function CardMovimientos () {
  const [movimientos, setMovimiento] = useState(0)

  useEffect(() => {
    fetch("http://localhost:3000/api/impresoras")
      .then((res) => res.json())
      .then((data) => {
        
      })
  }, [])

  return(
      <>
      </>
  )
}

export default CardMovimientos