import { useEffect, useRef } from 'react'

function NetworkBackground() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const nodesRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = window.innerWidth
    let height = window.innerHeight

    // Set canvas size
    const setCanvasSize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    setCanvasSize()

    // Node class for 3D effect
    class Node {
      constructor() {
        this.reset()
      }

      reset() {
        // Random position in 3D space
        this.x = (Math.random() - 0.5) * width * 1.5
        this.y = (Math.random() - 0.5) * height * 1.5
        this.z = Math.random() * 1000 + 200 // Depth
        
        // Movement velocity
        this.vx = (Math.random() - 0.5) * 0.5
        this.vy = (Math.random() - 0.5) * 0.5
        this.vz = (Math.random() - 0.5) * 2
        
        // Node size
        this.baseRadius = Math.random() * 2 + 1
      }

      update() {
        // Update position
        this.x += this.vx
        this.y += this.vy
        this.z += this.vz

        // Reset if out of bounds
        if (this.z < 50 || this.z > 1500) {
          this.reset()
        }
        if (Math.abs(this.x) > width || Math.abs(this.y) > height) {
          this.vx *= -1
          this.vy *= -1
        }
      }

      getProjected() {
        // 3D to 2D projection
        const scale = 800 / (800 + this.z)
        const x2d = this.x * scale + width / 2
        const y2d = this.y * scale + height / 2
        return { x: x2d, y: y2d, scale, z: this.z }
      }

      draw(ctx) {
        const projected = this.getProjected()
        const radius = this.baseRadius * projected.scale
        const alpha = Math.max(0.2, 1 - projected.z / 1200)

        // Draw node
        ctx.beginPath()
        ctx.arc(projected.x, projected.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(150, 170, 220, ${alpha})`
        ctx.fill()

        // Draw glow for larger nodes
        if (radius > 2) {
          ctx.beginPath()
          ctx.arc(projected.x, projected.y, radius * 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(100, 150, 220, ${alpha * 0.3})`
          ctx.fill()
        }
      }
    }

    // Initialize nodes
    const nodeCount = Math.min(150, Math.floor((width * height) / 8000))
    nodesRef.current = Array.from({ length: nodeCount }, () => new Node())

    // Animation loop
    const animate = () => {
      // Clear with fade effect
      ctx.fillStyle = 'rgba(13, 13, 26, 0.3)'
      ctx.fillRect(0, 0, width, height)

      const nodes = nodesRef.current

      // Update and draw nodes
      nodes.forEach(node => {
        node.update()
        node.draw(ctx)
      })

      // Draw connections
      const connectionDistance = 150
      const maxConnections = 3

      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i]
        const projA = nodeA.getProjected()
        let connections = 0

        for (let j = i + 1; j < nodes.length && connections < maxConnections; j++) {
          const nodeB = nodes[j]
          const projB = nodeB.getProjected()

          // Calculate distance in 2D projected space
          const dx = projA.x - projB.x
          const dy = projA.y - projB.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < connectionDistance * projA.scale) {
            connections++
            
            // Calculate alpha based on distance and depth
            const avgZ = (projA.z + projB.z) / 2
            const alpha = Math.max(0.05, 0.4 - distance / connectionDistance) * (1 - avgZ / 1200)
            
            // Draw line
            ctx.beginPath()
            ctx.moveTo(projA.x, projA.y)
            ctx.lineTo(projB.x, projB.y)
            ctx.strokeStyle = `rgba(120, 140, 200, ${alpha})`
            ctx.lineWidth = 0.5 * projA.scale
            ctx.stroke()
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      setCanvasSize()
      // Reinitialize nodes for new size
      const newNodeCount = Math.min(150, Math.floor((width * height) / 8000))
      if (newNodeCount !== nodesRef.current.length) {
        nodesRef.current = Array.from({ length: newNodeCount }, () => new Node())
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: '#0d0d1a'
      }}
    />
  )
}

export default NetworkBackground
