# Parsing Guide for Program Listing Screenshots → JSON

Keep your output consistent across universities and screenshots. Use this guide as your checklist.

---

## 1) Base JSON Skeleton

Start every file with this structure:

```json
{
  "name": "University Name",
  "country": "Country Name",
  "location": "City, State/Province",
  "rating": 5,
  "students": "24,000+",
  "courses": [],
  "description": "Brief overview of university or dataset.",
  "image": "https://images.unsplash.com/photo-xxxxxxx?w=800&q=80",
  "isActive": true
}
```

---

## 2) Course Item Format (inside `courses` array)

Each course must follow this exact order and formatting:

```json
{
  "programName": "Full program title",
  "degreeType": "Master's",
  "tuition": "£18,100 GBP",
  "applicationFee": "Free",
  "duration": "12 months",
  "successPrediction": "Jan 2026: High, Feb 2026: Average, Sep 2026: High",
  "tags": ["High Job Demand", "Fast Acceptance"]
}
```

**Rules**
- **programName**: copy exactly as shown.
- **degreeType**: keep plain terms (e.g., `Master's`, `Bachelor's`, `Diploma`).
- **tuition**: include symbol and currency exactly (e.g., `£18,100 GBP`, `$20,000 CAD`).
- **applicationFee**: either `"Free"` or amount + currency (e.g., `"125 CAD"`).
- **duration**: copy full text (e.g., `"16 - 24 months"`).
- **successPrediction**: **single comma-separated string** of `Month Year: Level`. Do **not** use objects or arrays.
  - Example: `"Jan 2026: High, Feb 2026: Average, Sep 2027: High"`
- **tags**: include visible badges only (e.g., `"High Job Demand"`, `"Fast Acceptance"`, `"Prime"`, `"Loans"`, `"Instant Submission"`). If none, use `[]`.

---

## 3) Description

Write 1–3 sentences that:
- Identify the university or dataset scope.
- Summarize program types (e.g., business, law, tech).
- Mention outcomes or employability when relevant.

Example:
```json
"description": "BPP University London offers postgraduate programs in business and law with a focus on practical skills and employability."
```

---

## 4) Image

Use high-quality Unsplash images for university previews with 800px width and good quality:
- `"https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80"` (Modern university building)
- `"https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80"` (Classic academic architecture)
- `"https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80"` (Contemporary campus)
- `"https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=80"` (University campus exterior)
- `"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"` (Students on campus)
- `"https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800&q=80"` (Modern lecture hall)

Choose images that match the university's style and character. Rotate through different images to provide visual variety.

---

## 5) Consistency Checklist

- Property order inside each course: **programName → degreeType → tuition → applicationFee → duration → successPrediction → tags**.
- Keep currencies and symbols as shown on the screenshot.
- Keep **successPrediction** in chronological order when possible.
- Use `"isActive": true` (lowercase true).
- Don't invent fields. Don't convert prediction strings into objects/arrays.
- Always verify university names match exactly what's shown in the screenshot.

---

## 6) Multiple Universities in One Screenshot

Create **one JSON object per university**. Save as a top-level array:

```json
[
  { "name": "BPP University - London", ... },
  { "name": "Wilfrid Laurier University - Brantford", ... }
]
```

---

## 7) File Naming

Use this pattern to stay organized:
- `bpp-university-uk-YYYY-MM-DD.json`
- `canada-universities-YYYY-MM-DD.json`
- `uk-universities-multiple-YYYY-MM-DD.json`

---

## 8) Quick Template (copy/paste)

```json
{
  "name": "",
  "country": "",
  "location": "",
  "rating": 5,
  "students": "24,000+",
  "courses": [
    {
      "programName": "",
      "degreeType": "",
      "tuition": "",
      "applicationFee": "",
      "duration": "",
      "successPrediction": "",
      "tags": []
    }
  ],
  "description": "",
  "image": "https://images.unsplash.com/photo-xxxxxxx?w=800&q=80",
  "isActive": true
}
```

---

## 9) Common Pitfalls

- ❌ Writing `successPrediction` as an object like `{ "Jan 2026": "High" }`.
- ❌ Dropping currency symbols or units.
- ❌ Changing field order inside a course.
- ❌ Mixing multiple universities into one object without using an array.
- ❌ Using university logo URLs instead of Unsplash preview images.
- ❌ Inventing university names that don't appear in the screenshot.
- ❌ Using the same Unsplash image for all universities - rotate for variety.

---

## 10) Validation Steps Before Finalizing

1. ✅ Count universities in screenshot - does your JSON match?
2. ✅ Verify each university name appears exactly as shown
3. ✅ Check all tuition amounts include currency symbols
4. ✅ Confirm successPrediction is a single string, not an object
5. ✅ Ensure each university has a unique Unsplash image
6. ✅ Validate tags only include visible badges from screenshot
7. ✅ Review field order in each course object