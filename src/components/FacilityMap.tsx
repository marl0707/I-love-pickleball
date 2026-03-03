'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Leafletのデフォルトアイコン設定を修正（Next.js環境下での表示不具合対策）
const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

interface FacilityMapProps {
    lat: number | null;
    lng: number | null;
    name: string;
}

export default function FacilityMap({ lat, lng, name }: FacilityMapProps) {
    // SSR時のハイドレーションエラーを防止するため、マウント完了後のみ表示
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center">
                <span className="text-gray-400 font-bold">地図を読み込み中...</span>
            </div>
        );
    }

    // 緯度経度が取得できていない場合のフォールバック
    if (!lat || !lng) {
        return (
            <div className="w-full h-[400px] bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center">
                <span className="text-gray-500">位置情報が設定されていません</span>
            </div>
        );
    }

    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-100 z-0 relative">
            <MapContainer
                center={[lat, lng]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false} // スクロールでの勝手なズームを無効化
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]} icon={customIcon}>
                    <Popup className="font-sans font-bold text-gray-800">
                        {name}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
