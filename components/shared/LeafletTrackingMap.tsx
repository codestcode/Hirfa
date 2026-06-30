'use client'

import { useEffect, useRef } from 'react'

interface LeafletTrackingMapProps {
  clientLat: number
  clientLng: number
  workerLat?: number | null
  workerLng?: number | null
}

export default function LeafletTrackingMap({ clientLat, clientLng, workerLat, workerLng }: LeafletTrackingMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const routeRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return

    const loadLeaflet = async () => {
      if (!(window as any).L) {
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link')
          link.id = 'leaflet-css'
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          document.head.appendChild(link)
        }

        await new Promise((resolve) => {
          const script = document.createElement('script')
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
          script.onload = resolve
          document.head.appendChild(script)
        })
      }

      const L = (window as any).L
      if (!L) return

      if (!mapInstance.current) {
        mapInstance.current = L.map(mapRef.current, {
          center: [clientLat, clientLng],
          zoom: 14,
          zoomControl: false
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap'
        }).addTo(mapInstance.current)
      }

      const map = mapInstance.current

      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
      if (routeRef.current) {
        routeRef.current.remove()
        routeRef.current = null
      }

      const clientIcon = L.divIcon({
        html: `<div class="w-6 h-6 bg-[#FF8A00] border-2 border-white rounded-full shadow-lg flex items-center justify-center text-white"><div class="w-2 h-2 bg-white rounded-full"></div></div>`,
        className: '',
        iconSize: [24, 24]
      })

      const workerIcon = L.divIcon({
        html: `<div class="w-8 h-8 bg-[#22C55E] border-2 border-white rounded-full shadow-lg flex items-center justify-center text-lg">🛠️</div>`,
        className: '',
        iconSize: [32, 32]
      })

      const clientMarker = L.marker([clientLat, clientLng], { icon: clientIcon }).addTo(map)
      markersRef.current.push(clientMarker)

      if (workerLat && workerLng) {
        const workerMarker = L.marker([workerLat, workerLng], { icon: workerIcon }).addTo(map)
        markersRef.current.push(workerMarker)

        const routePoints = [
          [workerLat, workerLng],
          [clientLat, clientLng]
        ]
        const polyline = L.polyline(routePoints, {
          color: '#FF8A00',
          weight: 4,
          dashArray: '5, 8'
        }).addTo(map)
        routeRef.current = polyline

        const bounds = L.latLngBounds([[clientLat, clientLng], [workerLat, workerLng]])
        map.fitBounds(bounds, { padding: [40, 40] })
      } else {
        map.setView([clientLat, clientLng], 14)
      }
    }

    loadLeaflet()

    return () => {
      // Keeping the map instance active for persistent display, but clearing references on cleanup if unmounted
    }
  }, [clientLat, clientLng, workerLat, workerLng])

  return <div ref={mapRef} className="w-full h-full min-h-[220px] bg-[#0A0D1A]" />
}
