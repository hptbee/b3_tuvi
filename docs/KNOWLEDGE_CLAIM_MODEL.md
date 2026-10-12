# Mô hình claim nguyên tử (chưa đưa vào database)

Một claim là một ý, không phải một đoạn luận. P1.3A không tạo claim đã kiểm cho 63 cách, vì không có đoạn sách.

## Loại

`placement`, `combination_match`, `formation`, `breaking`, `strengthening`, `weakening`, `interpretation`, `school_variant`, `conflict`.

Câu có điều kiện (“nếu hãm”, “nếu gặp sát”) giữ điều kiện trong `conditions`. Không viết thành luật tuyệt đối.

## Trường

| Trường | Ý |
|---|---|
| `claimId` | Khóa ổn định, không lấy từ tên hiển thị |
| `claimType` | Một loại ở trên |
| `subject` | Sao, cung, hoặc `combinationId` |
| `predicate` | Một mệnh đề |
| `conditions` | Tiền đề, có thể rỗng |
| `relatedStars` | Id sao catalog (`tu_vi`, …) |
| `relatedPalaces` | Id chức (`menh`, …) |
| `schoolId` | Ví dụ `vn-tam-hop-default`, hoặc null |
| `sourceReferences` | `{ sourceId, chapter, section, page, location, supportType, verificationStatus }` |
| `verificationStatus` | Xem bốn lớp bên dưới |
| `contradicts` | `claimId` khác, không gộp im |
| `supports` | `claimId` khác |
| `notes` | Chỗ chưa rõ |

`page` null cho đến khi cầm đúng lần in. `supportType`: `states`, `paraphrase`, `conflicts`, `comments`.

## Bốn lớp trạng thái, không gộp điểm

| Lớp | Giá trị gợi ý | Không suy từ |
|---|---|---|
| `implementationStatus` | `untested`, `tested`, `not_executable` | Sách đúng |
| `formulaStatus` | `undocumented`, `matches_repo_formula`, `checked_against_edition` | Test pass |
| `bibliographicStatus` | như sổ nguồn | Schema JSON hợp lệ |
| `interpretationStatus` | `unreviewed`, `sourced`, `absolute_claim_needs_review` | Công thức vị trí khớp |

Schema JSON hợp lệ chỉ chứng minh file không vỡ. Test `knowledgeCatalog.test.mjs` cố ý cấm `bibliographicStatus: primary` và cấm `formulaCheckedAgainstSource: true` trong catalog hiện tại. Cổng edition là `authenticated: true`; đối chữ và phạm vi chấp nhận là metadata.

## Ví dụ hình thức, chưa phải claim của dự án

```json
{
  "claimId": "example-not-loaded",
  "claimType": "school_variant",
  "subject": "van_tinh",
  "predicate": "Can Nhâm an tại Dần trong hồ sơ mặc định",
  "conditions": ["schoolId = vn-tam-hop-default"],
  "relatedStars": ["van_tinh"],
  "relatedPalaces": [],
  "schoolId": "vn-tam-hop-default",
  "sourceReferences": [],
  "verificationStatus": {
    "implementationStatus": "tested",
    "formulaStatus": "matches_repo_formula",
    "bibliographicStatus": "secondary",
    "interpretationStatus": "unreviewed"
  },
  "contradicts": [],
  "supports": [],
  "notes": "Dị bản Dậu nằm trong TU_VI_SCHOOL_VARIANTS.md. Chưa tách thành claim vì chưa có trang sách."
}
```

Claim này không nằm trong file nạp runtime.
