# Cabin Card Design - Singita Style

## Struktur Card Baru

Card cabin sudah diubah mengikuti desain referensi dengan struktur:

### Layout
```
┌─────────────────────────────────────────────────┐
│  [Image]          │  Cabin Name    [Cabin details >] │
│   ← →            │  Location                      │
│                  │                                │
│                  │  ┌──────────────────────────┐ │
│                  │  │ Great news, we have...   │ │
│                  │  │ Select the result...      │ │
│                  │  └──────────────────────────┘ │
│                  │                                │
│                  │  Cabin          1 available   │
│                  │  Date: Dec 19 • Available...  │
│                  │  [Room & Rate] [Add to itinerary] │
└─────────────────────────────────────────────────┘
```

### Komponen Utama

1. **Cabin Image** (400px × 300px)
   - Image dengan object-fit cover
   - Tombol navigasi gallery (← →) overlay di tengah vertikal
   - Tombol circular putih semi-transparan
   - Hover: background abu-abu

2. **Cabin Header**
   - **Kiri**: Nama cabin (serif, 2rem) + lokasi (italic)
   - **Kanan**: Button "Cabin details ›" (blue link style)
   - Flexbox dengan space-between

3. **Availability Box**
   - Background: `#e8f3ea` (hijau muda)
   - Border kiri: 4px solid `#4a7c59`
   - Title: "Great news, we have availability!"
   - Text penjelasan di bawahnya

4. **Cabin Info Section**
   - Border top separator
   - Header: "Cabin" | "X available"
   - Date info detail
   - Action buttons: "Room & Rate Details" + "Add to itinerary"

## File yang Diubah

### 1. `src/views/Results.vue`
```vue
<div class="cabin-card">
  <div class="cabin-image">
    <img ... />
    <button class="gallery-nav gallery-prev">‹</button>
    <button class="gallery-nav gallery-next">›</button>
  </div>
  <div class="cabin-content">
    <div class="cabin-header">
      <div class="cabin-title-group">
        <h3 class="cabin-name">{{ item.cabinName }}</h3>
        <p class="cabin-location">{{ item.operatorLabel }}</p>
      </div>
      <button class="cabin-details-btn">
        Cabin details <span class="arrow-icon">›</span>
      </button>
    </div>
    <div class="availability-box">
      <h4 class="availability-title">Great news...</h4>
      <p class="availability-text">Select the result...</p>
    </div>
    <div class="cabin-info-section">
      ...
    </div>
  </div>
</div>
```

### 2. `src/styles/pages/results.css`

**Class baru:**
- `.cabin-card` - container utama (grid 400px 1fr)
- `.cabin-image` - wrapper image dengan relative position
- `.gallery-nav` - tombol navigasi circular overlay
- `.cabin-content` - wrapper konten kanan (padding 2rem 2.5rem)
- `.cabin-header` - header dengan flexbox
- `.cabin-title-group` - group nama dan lokasi
- `.cabin-name` - judul cabin (serif, 2rem)
- `.cabin-location` - subjudul lokasi (italic, brown)
- `.cabin-details-btn` - button "Cabin details" (blue link)
- `.availability-box` - box hijau availability
- `.cabin-info-section` - section info cabin
- `.cabin-actions` - wrapper tombol aksi
- `.btn-cabin-details` - button "Room & Rate Details"
- `.btn-add-to-itinerary` - button orange "Add to itinerary"

## Warna & Tipografi

### Warna
- Background card: `white`
- Nama cabin: `#2d4059` (navy)
- Lokasi: `#8b7355` (brown)
- Link button: `#3b82f6` (blue)
- Availability box bg: `#e8f3ea` (mint green)
- Availability box border: `#4a7c59` (dark green)
- Text hijau: `#2d5f3f`, `#4a7c59`
- Button orange: `#ea580c`
- Text abu: `#6b7280`

### Font
- Cabin name: serif (Playfair Display), 2rem, font-weight 400
- Location: 1rem, italic
- Body text: sans-serif default
- Button: 0.9rem - 0.95rem, font-weight 500

## Responsif

**Breakpoint: 968px**
- Card jadi single column (image di atas)
- Padding content: 1.5rem
- Cabin name: 1.5rem
- Header jadi column layout

## Interaksi

1. **Gallery Nav Hover**: background abu semi-transparan
2. **Cabin details Button Hover**: opacity 0.7
3. **Room & Rate Button Hover**: background #f9fafb
4. **Add to Itinerary Hover**: background #c2410c (darker orange)

## Testing

✅ Build berhasil tanpa error
✅ Layout horizontal di desktop
✅ Layout stacked di mobile
✅ Semua button clickable
✅ Image dengan fallback error handler
✅ Drive image normalization tetap berfungsi
