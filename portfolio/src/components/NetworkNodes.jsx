import { useEffect, useRef } from 'react'
import './NetworkNodes.css'

const NODE_COUNT = 180
const CONNECTION_DISTANCE = 180

function NetworkNodes() {
  const canvasRef = useRef(null)
  const nodesRef = useRef([])
  const animRef = useRef(null)
  const scrollOffsetRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.scale(dpr, dpr)

      // Redistribute nodes on resize
      const w = window.innerWidth
      const h = window.innerHeight
      nodesRef.current.forEach(node => {
        node.x = Math.random() * w
        node.y = Math.random() * h
      })
    }

    // Initialize nodes with varying depth layers for parallax
    nodesRef.current = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2.5 + 1.5,
      depth: Math.random() * 0.4 + 0.1 // 0.1 to 0.5 parallax factor
    }))

    resize()
    window.addEventListener('resize', resize)

    const handleScroll = () => {
      scrollOffsetRef.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const animate = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const scroll = scrollOffsetRef.current
      ctx.clearRect(0, 0, w, h)
      const nodes = nodesRef.current

      // Update base positions
      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > w) node.vx *= -1
        if (node.y < 0 || node.y > h) node.vy *= -1
      }

      // Calculate parallax-shifted positions
      const shifted = nodes.map(node => ({
        x: node.x,
        y: node.y - scroll * node.depth,
        r: node.r,
        depth: node.depth
      }))

      // Draw connections using shifted positions
      for (let i = 0; i < shifted.length; i++) {
        // Skip nodes that are off screen
        if (shifted[i].y < -100 || shifted[i].y > h + 100) continue
        for (let j = i + 1; j < shifted.length; j++) {
          if (shifted[j].y < -100 || shifted[j].y > h + 100) continue
          const dx = shifted[i].x - shifted[j].x
          const dy = shifted[i].y - shifted[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < CONNECTION_DISTANCE) {
            const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.3
            ctx.beginPath()
            ctx.moveTo(shifted[i].x, shifted[i].y)
            ctx.lineTo(shifted[j].x, shifted[j].y)
            ctx.strokeStyle = `rgba(20, 184, 166, ${opacity})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }
      }

      // Draw nodes at shifted positions
      for (const node of shifted) {
        if (node.y < -50 || node.y > h + 50) continue
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(20, 184, 166, 0.4)'
        ctx.fill()
      }

      animRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return <canvas ref={canvasRef} className="network-nodes" />
}

export default NetworkNodes
