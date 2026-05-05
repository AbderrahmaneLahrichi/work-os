import { useEffect, useRef } from 'react'
import './NetworkNodes.css'

function getNodeCount() {
  const w = window.innerWidth
  const pages = Math.max(document.body.scrollHeight, window.innerHeight * 3) / window.innerHeight
  const scale = Math.ceil(pages)
  if (w <= 600) return 40 * scale
  if (w <= 900) return 60 * scale
  if (w <= 1200) return 80 * scale
  return 100 * scale
}

function getConnectionDistance() {
  return window.innerWidth <= 600 ? 120 : 180
}

function NetworkNodes() {
  const canvasRef = useRef(null)
  const nodesRef = useRef([])
  const animRef = useRef(null)
  const scrollRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let nodeCount = getNodeCount()
    let connDist = getConnectionDistance()

    // Spread nodes across the full document height
    const getPageHeight = () => {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        window.innerHeight * 3
      )
    }

    const initNodes = (count) => {
      const w = window.innerWidth
      const totalH = getPageHeight()
      return Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * totalH,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2.5 + 1.5
      }))
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = window.innerWidth + 'px'
      canvas.style.height = window.innerHeight + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const newCount = getNodeCount()
      connDist = getConnectionDistance()
      if (newCount !== nodeCount) {
        nodeCount = newCount
        nodesRef.current = initNodes(nodeCount)
      }
    }

    nodesRef.current = initNodes(nodeCount)
    resize()
    window.addEventListener('resize', resize)

    const handleScroll = () => {
      scrollRef.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const animate = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const scroll = scrollRef.current
      const totalH = getPageHeight()
      ctx.clearRect(0, 0, w, h)
      const nodes = nodesRef.current
      const connDistSq = connDist * connDist

      // Update positions — nodes float across the full page
      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > w) node.vx *= -1
        if (node.y < 0 || node.y > totalH) node.vy *= -1
      }

      // Only process nodes visible in the current viewport (with buffer)
      const viewTop = scroll - 200
      const viewBottom = scroll + h + 200
      const visible = []
      for (const node of nodes) {
        if (node.y >= viewTop && node.y <= viewBottom) {
          visible.push(node)
        }
      }

      // Draw connections between visible nodes
      ctx.lineWidth = 0.8
      for (let i = 0; i < visible.length; i++) {
        const screenY_i = visible[i].y - scroll
        const sx = visible[i].x
        for (let j = i + 1; j < visible.length; j++) {
          const screenY_j = visible[j].y - scroll
          const dx = sx - visible[j].x
          const dy = screenY_i - screenY_j
          const distSq = dx * dx + dy * dy
          if (distSq < connDistSq) {
            const opacity = (1 - Math.sqrt(distSq) / connDist) * 0.45
            ctx.beginPath()
            ctx.moveTo(sx, screenY_i)
            ctx.lineTo(visible[j].x, screenY_j)
            ctx.strokeStyle = `rgba(20, 184, 166, ${opacity})`
            ctx.stroke()
          }
        }
      }

      // Draw visible nodes
      ctx.fillStyle = 'rgba(20, 184, 166, 0.65)'
      for (const node of visible) {
        const screenY = node.y - scroll
        ctx.beginPath()
        ctx.arc(node.x, screenY, node.r, 0, Math.PI * 2)
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
