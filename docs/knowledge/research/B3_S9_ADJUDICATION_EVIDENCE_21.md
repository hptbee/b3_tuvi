# B3 Tử Vi — Evidence pack for unresolved Sprint 9 decisions

**Date:** 2026-10-13 · **PR:** https://github.com/hptbee/b3_tuvi/pull/19 · **baseline:** `7a4504c580dbafcabdd904b3fec0d08cf5f7a02b`

## Scope, limitations, and verified facts

This is an independent *discovery and adjudication handoff* based on the current PR decisions and publicly accessible text. It is NOT a proof that all 21 conflicts are settled. No PDF facsimile of Tân Biên was examined. Chinese Wikisource is a digital transcription; modern websites are secondary interpretations. URLs and passage locators must be re-fetched, text hashed, and independently checked inside Cursor before promotion.

**Current PR state (checked 2026-10-13):** 63/63 review execution; 42 `AI_ACCEPTED`, 20 cross-review `CONFLICT`, 1 Tân Biên `UNRESOLVED`. Of Sprint 9C 39 identities, 3 are `NAME_MISMATCH`, 36 `UNRESOLVED_IDENTITY`. These are source/identity/decision metrics, not formula verification.

**Most important technical issue:** do not compare *basic formation* with *quý cách/full-grade* as if the same predicate. Where a source explicitly says 基本條件 vs 貴格, encode separate claim IDs; do not loosen the comparator to convert a disagreement into `AI_ACCEPTED`.

## Primary-transcription excerpts confirmed on Wikisource

Wikisource page: https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽?oldid=850734

- **Thạch Trung Ẩn Ngọc** — 卷一, section near `論石中隱玉格`: `命在子午逢巨門是也`; next poem adds 三方科祿. This permits basic versus advanced-grade claims, not an unqualified single strict formula.
- **Văn Tinh** — 卷一, `論文星朝命格`: includes 昌曲 and further 三方祥曜. Title uses 朝命, not necessarily a documented historical alias of 拱命.
- **Lộ Bàng** — 卷一, `太微賦`: `七殺廉貞同位，路上埋屍`. The sentence alone does not mention Hóa Kỵ or the Sửu/Mùi branches.
- **Mã Lạc Không Vong** — 卷一, `太微賦`: `馬遇空亡，終身奔走`; detailed exact 空 predicate is not fully spelled out in that sentence.
- **Nhật Lệ Trung Thiên** — 卷一, `太微賦`: `太陽居午，謂之日麗中天`.
- **Thủy Trừng Quế Ngạc** — same section: `太陰居子，號曰水澄桂萼`; modern alternative adding 天同 must be sourced as separate variant.

## 21 conflict targets — target-specific research leads

### 1. Anh Tinh Nhập Miếu (英星入廟) — 9C
- **Primary lead:** https://www.108s.tw/article/info/208
- **Second source/contrast:** https://astroverse.com.tw/ziwei/patterns/ying-xing-ru-miao
- **What retrieved source supports / suggests:** 108s states Phá Quân alone at Tý/Ngọ is the basic pattern; strict noble-grade requires favorable year/transformations and no disruptive stars. Astroverse likewise distinguishes positional test from original verse with 無殺.
- **What Cursor must decide:** Separate basic formation from quý cách. Ask whether Grok compared full noble grade while Terra compared structural recognition. Do not add all favorable conditions to base rule.
- **Evidence grading:** STRONG_MODERN_TWO_TIER / SECONDARY. **Not yet verified as a B3 accepted decision.**

### 2. Hình Kỵ Giáp Ấn (刑忌夾印) — 9C
- **Primary lead:** https://www.108s.tw/article/info/206
- **Second source/contrast:** https://m.guoxuedashi.net/a/22590h/285876n.html
- **What retrieved source supports / suggests:** 108s explicitly identifies school-level differences: some schools use 羊陀夾天相, their school instead has 天相化忌 with 擎羊. Lu Bin Zhao commentary gives 擎羊 + 化忌 in flanking palaces as formal pattern; another 天梁 variant.
- **What Cursor must decide:** This is a REAL SCHOOL VARIANT; record separate formulas with source+school, not consensus one rule. Distinguish 刑忌夾印 from 刑囚夾印.
- **Evidence grading:** STRONG_VARIANT / SECONDARY_BOOK_TRANSCRIPTION. **Not yet verified as a B3 accepted decision.**

### 3. Nhật Nguyệt Tật Ách (日月疾厄格) — 9C
- **Primary lead:** https://display.tw/p122.htm
- **Second source/contrast:** https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽?oldid=850734
- **What retrieved source supports / suggests:** PR19 source says Sun + Moon at 疾厄; Hóa Kỵ is not in the bound passage. Wikisource chapter 二/六疾厄 can serve as secondary context but not prove a named 日月疾厄格.
- **What Cursor must decide:** Challenge Hóa Kỵ as mandatory; distinguish named pattern, palace placement, and interpretive consequences. Require a second exact-definition source before claiming historical identity.
- **Evidence grading:** SECONDARY_ONLY / SECONDARY. **Not yet verified as a B3 accepted decision.**

### 4. Sát Phá Tham (殺破狼) — 9C
- **Primary lead:** https://astroverse.com.tw/ziwei/patterns/sha-po-lang
- **Second source/contrast:** https://ichingquest.com/zh-TW/fortune/ziwei/shapolang
- **What retrieved source supports / suggests:** Both pages describe 七殺 破軍 貪狼 as a three-way geometric system; Astroverse explicitly says a dedicated 古書賦 line was not located. The three stars always form a 삼합 structural group.
- **What Cursor must decide:** Separate stellar-system geometry from contingent wealth/eminence conditions; test whether the rule is tautological with respect to the stars and whether Mệnh must fall into their three houses.
- **Evidence grading:** MODERN_GEOMETRIC / SECONDARY. **Not yet verified as a B3 accepted decision.**

### 5. Thạch Trung Ẩn Ngọc (石中隱玉) — 9C
- **Primary lead:** https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽?oldid=850734
- **Second source/contrast:** https://www.108s.tw/article/info/227
- **What retrieved source supports / suggests:** Wikisource 卷一 女命骨髓賦 appended patterns: 論石中隱玉格 命在子午逢巨門是也; the following poem adds 得三方科祿照. 108s labels Cự Môn at Tý/Ngọ basic; Lộc/Quyền and no sát for quý cách.
- **What Cursor must decide:** STRONG primary-transcription evidence for two-tier interpretation: basic=巨門命宮子午; upgrade=三方科祿. Determine exactly which category model A/B compared, do not collapse.
- **Evidence grading:** PRIMARY_TRANSCRIPTION_PLUS_SECONDARY / WIKISOURCE_TRANSCRIPTION. **Not yet verified as a B3 accepted decision.**

### 6. Thiên Ất Củng Mệnh (天乙拱命) — 9C
- **Primary lead:** https://www.108s.tw/article/info/262
- **Second source/contrast:** https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽?oldid=850734
- **What retrieved source supports / suggests:** 108s formation is 天魁+天鉞 in Mệnh 三方四正; it contrasts with 坐貴向貴 and does not require both in 命/遷 specifically. Wikisource mentions 魁鉞同行, but not necessarily title 天乙拱命.
- **What Cursor must decide:** Compare geometric pattern vs narrower opposite-palace version; do not derive exact historical title from the older generic phrase.
- **Evidence grading:** STRONG_MODERN_FORMULA / SECONDARY. **Not yet verified as a B3 accepted decision.**

### 7. Tử Phủ Vũ Tướng (紫府武相) — 9C
- **Primary lead:** https://www.newton.com.tw/wiki/紫府武相/2085692
- **Second source/contrast:** https://www.108s.tw/article/info/196
- **What retrieved source supports / suggests:** A modern encyclopedia defines a four-star constellation meeting in 三方四正; 108s details 紫府朝垣 which is a DIFFERENT named pattern. No primary defining passage for the exact title was verified.
- **What Cursor must decide:** Treat 108s as related, not identity proof. Establish exact identity by a named source; test each star placement using diagram instead of inferring it from a title. Do not force MATCH.
- **Evidence grading:** WEAK_IDENTITY / TERTIARY. **Not yet verified as a B3 accepted decision.**

### 8. Văn Tinh Củng Mệnh (文星拱命 / 文星朝命) — 9C
- **Primary lead:** https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽?oldid=850734
- **Second source/contrast:** https://ziweidoushu.com9.tw/pattern/20
- **What retrieved source supports / suggests:** Primary transcription at 卷一: 論文星朝命格 followed by 文昌文曲 most glorious + further 三方 favorable stars. Modern pattern treats 文昌/文曲 in Mệnh three-way aspects as base; extra auspicious condition differs.
- **What Cursor must decide:** Investigate 朝命↔拱命 as edition/school alias, separate two 文星 from additional 吉星 strength. Check whether same-palace requires separate subvariant.
- **Evidence grading:** PRIMARY_TRANSCRIPTION_PLUS_SECONDARY / WIKISOURCE_TRANSCRIPTION. **Not yet verified as a B3 accepted decision.**

### 9. Bán Không Chiết Xỉ (半天折翅 / 半空折翅) — 9C
- **Primary lead:** https://www.shenjige.cn/details/eL5LpHbar.html
- **Second source/contrast:** https://www.108s.tw/article/info/267
- **What retrieved source supports / suggests:** The wording actually found is 生逢天空，猶如半天折翅, inside 命里逢空 discussion. B3 name Bán Không Chiết Xỉ diverges from 折翅 (wings broken), and this text does not define an independent named pattern with that label.
- **What Cursor must decide:** Keep NAME_MISMATCH. Research whether Vietnamese phrase should be 半天折翅, not 半空折齒; if unsupported, deprecate/rename catalog label in separate approved proposal, not change rule in current PR.
- **Evidence grading:** LIKELY_MISNAMED / SECONDARY. **Not yet verified as a B3 accepted decision.**

### 10. Lộ Bàng Mai Thi (路上埋屍) — 9C
- **Primary lead:** https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽?oldid=850734
- **Second source/contrast:** https://xingge.tw/zh-hant/quanshu/tongyuan-qisha
- **What retrieved source supports / suggests:** Wikisource 太微賦 explicitly says 七殺廉貞同位，路上埋屍. The old phrase itself does not say Sửu/Mùi or Hóa Kỵ; modern explanation says 廉貞+七殺 can occupy Sửu/Mùi and later comments add 落陷 化忌 as worsening.
- **What Cursor must decide:** Resolve condition-list disagreement by tagging 廉殺同位 as literal formation; Sửu/Mùi as derived astronomical consequence requiring star-placement proof; 化忌 as commentary/strengthening not a requirement in this quoted sentence.
- **Evidence grading:** PRIMARY_TRANSCRIPTION / WIKISOURCE_TRANSCRIPTION. **Not yet verified as a B3 accepted decision.**

### 11. Mệnh VCD Đắc Tam Không (無正曜 得三空 / 三空) — 9C
- **Primary lead:** https://phamngochien.com.vn/doi-dieu-ban-ve-12-cung-vo-chinh-dieu-dang-xuan-xuyen-ha-noi/
- **Second source/contrast:** https://www.shenjige.cn/details/eL5LpHbar.html
- **What retrieved source supports / suggests:** PR19 bound source expects Vô Chính Diệu, Tuần/Triệt and Thiên Không aspect; other Đắc/Ngộ/Kiến variants use different definitions. Related Mệnh里逢空 cannot prove 得三空; definitions vary.
- **What Cursor must decide:** Model discrepancy thien_khong_aspect is likely classification of aspect vs presence. Make evidence matrix distinguishing Đắc/Ngộ/Kiến and explicit required no-major. Preserve school variants if still inconsistent.
- **Evidence grading:** SCHOOL_SPECIFIC_VIETNAMESE / VIETNAMESE_SECONDARY. **Not yet verified as a B3 accepted decision.**

### 12. Nhật Nguyệt Tịnh Minh (日月並明 / 丹墀桂墀) — 9B
- **Primary lead:** https://www.108s.tw/article/info/250
- **Second source/contrast:** https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽?oldid=850734
- **What retrieved source supports / suggests:** 108s defines base as both 太陽 and 太陰 in 廟旺 within Mệnh 三方四正 and lists several configurations; extra Lộc/昌曲 pertains to quý cách.
- **What Cursor must decide:** Compare source to runtime by brightness and geometry, not assumption Sun+Moon must share palace. Tân Biên separate edition still needs page verification.
- **Evidence grading:** SECONDARY_TWO_TIER / SECONDARY. **Not yet verified as a B3 accepted decision.**

### 13. Cự Nhật Đồng Cung (巨日同宮) — 9B
- **Primary lead:** https://www.108s.tw/article/info/223
- **Second source/contrast:** https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽?oldid=850734
- **What retrieved source supports / suggests:** 108s gives 太陽+巨門 same palace at 寅/申? Page description includes 寅/未 wording that needs internal consistency check; ancient phrase 巨日同宮官封三代 is cited.
- **What Cursor must decide:** Do not promote disputed branch 寅/未/申 without independent astronomical check; verify possible positions by the star algorithm/secondary diagram; differentiate physical co-location from bright-grade.
- **Evidence grading:** SOURCE_INTERNAL_CONFLICT / SECONDARY. **Not yet verified as a B3 accepted decision.**

### 14. Thất Sát Triều Đẩu (七殺朝斗) — 9B
- **Primary lead:** https://www.108s.tw/article/info/207
- **Second source/contrast:** https://www.108s.tw/article/info/332
- **What retrieved source supports / suggests:** 108s defines 七殺 Mệnh 寅/申 opposite 紫微天府 for base; additional 吉星 define high grade. Separate 寅 vs 申 relative Sun/Moon brightness.
- **What Cursor must decide:** Check if baseline Tân Biên formula requires another position and whether source references 仰斗 separately; annotate this as school/edition difference, not blanket conflict.
- **Evidence grading:** STRONG_MODERN_TWO_TIER / SECONDARY. **Not yet verified as a B3 accepted decision.**

### 15. Tham Vũ Đồng Hành (貪武同行 / 武貪) — 9B
- **Primary lead:** https://www.108s.tw/article/info/22
- **Second source/contrast:** https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽?oldid=850734
- **What retrieved source supports / suggests:** 108s describes 武曲/貪狼 combinations and differentiates 火鈴貪 alternatives; an exact defining passage of Tham Vũ Đồng Hành in Tân Biên has not been rechecked against PDF.
- **What Cursor must decide:** Require same-palace vs hội chiếu distinction from exact local source; use modern page as lead only.
- **Evidence grading:** RELATED_ONLY / SECONDARY. **Not yet verified as a B3 accepted decision.**

### 16. Mã Lạc Không Vong (馬落空亡) — 9B
- **Primary lead:** https://www.108s.tw/article/info/268
- **Second source/contrast:** https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽?oldid=850734
- **What retrieved source supports / suggests:** 108s defines 天馬 meeting 地空/地劫 same palace or opposite, while Wikisource 太微賦 says 馬遇空亡，終身奔走. One is shorthand, the other explanatory formula.
- **What Cursor must decide:** Break into exact aphorism, candidate operational predicates, and named formal pattern. Do not infer same-palace requirement exclusively from the aphorism.
- **Evidence grading:** PRIMARY_APHORISM_PLUS_MODERN_FORMULA / WIKISOURCE_TRANSCRIPTION. **Not yet verified as a B3 accepted decision.**

### 17. Tử Phủ Triều Viên (紫府朝垣) — 9B
- **Primary lead:** https://www.108s.tw/article/info/196
- **Second source/contrast:** https://www.ziweicn.com/ziweigeju/3047.html
- **What retrieved source supports / suggests:** 108s gives eight chart configurations and distinguishing criteria; other book-commentary site narrows explicit roles of 紫微/天府 relative to 命.
- **What Cursor must decide:** Compare four/eight cases separately and distinguish 紫府朝垣 from 紫府同宮 and 紫府武相.
- **Evidence grading:** STRONG_MODERN_MULTICASE / SECONDARY. **Not yet verified as a B3 accepted decision.**

### 18. Nhật Nguyệt Đồng Lâm (日月同臨) — 9B
- **Primary lead:** https://www.108s.tw/article/info/222
- **Second source/contrast:** https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽?oldid=850734
- **What retrieved source supports / suggests:** 108s defines 太陽+太陰 same palace 丑/未; auspicious stars and no 殺忌 concern noble grade.
- **What Cursor must decide:** Check if original Tân Biên formula at 19.2.14 matches shared palace/branches; distinguish name from broad Sun/Moon aspect.
- **Evidence grading:** STRONG_MODERN_FORMULA / SECONDARY. **Not yet verified as a B3 accepted decision.**

### 19. Hình Tù Giáp Ấn (刑囚夾印) — 9B
- **Primary lead:** https://www.108s.tw/article/info/210
- **Second source/contrast:** https://www.ziweicn.com/show/3201.html
- **What retrieved source supports / suggests:** Sources support 廉貞+天相+擎羊 in Mệnh 子/午. The term 夾 is conventional even though stars cohabit; this is NOT 刑忌夾印, whose structure varies by school.
- **What Cursor must decide:** Use exact Chinese characters 囚 vs 忌; never merge with Hình Kỵ Giáp Ấn. Test same-palace + location separately from neighboring-flank.
- **Evidence grading:** STRONG_MODERN_DISTINCTION / SECONDARY. **Not yet verified as a B3 accepted decision.**

### 20. Nhật Lệ Trung Thiên (日麗中天) — 9B
- **Primary lead:** https://www.108s.tw/article/info/221
- **Second source/contrast:** https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽?oldid=850734
- **What retrieved source supports / suggests:** Both 108s and Wikisource 太微賦 state 太陽居午; 108s further lists additional 吉祥 as quý-grade/strengthening not recognition.
- **What Cursor must decide:** If conflict over missing auspicious stars, split base=Sun Mệnh Ngọ versus quý-grade=meet stars. Original PDF page still unverified.
- **Evidence grading:** PRIMARY_TRANSCRIPTION_PLUS_SECONDARY / WIKISOURCE_TRANSCRIPTION. **Not yet verified as a B3 accepted decision.**

### 21. Kình Dương Nhập Miếu (Mã Đầu Đới Tiễn) (擎羊入廟 / 馬頭帶箭 / 馬頭帶劍) — 9B
- **Primary lead:** https://www.108s.tw/article/info/265
- **Second source/contrast:** https://www.108s.tw/article/info/219
- **What retrieved source supports / suggests:** 108s 擎羊入廟: 擎羊 alone at Mệnh 丑辰未戌. 馬頭帶箭: selected Mệnh 午 with year conditions. 馬頭帶劍: 108s says a DIFFERENT, usually unfavorable grouping. The three names must not be forcibly aliased.
- **What Cursor must decide:** P0 identity split. Kình Dương N.M. is not simply Mã Đầu Đới Tiễn. Recheck Tân Biên PDF and stored digest; do not coerce to a single combination.
- **Evidence grading:** CRITICAL_CONFLATION / SECONDARY. **Not yet verified as a B3 accepted decision.**

## Related critical catalog issues (not included in 21 pending decisions)

- **Thủy Trừng Quế Ngạc (太陰居子)**: Wikisource aphorism only requires Thái Âm at Tý; modern 月生滄海 gloss adds Thiên Đồng with Thái Âm at Tý. Strong evidence of two source-level definitions, not one objectively superior runtime rule. Source: https://zh.wikisource.org/zh-hant/紫微斗數全書/全覽?oldid=850734 ; https://www.108s.tw/article/info/239
- **Hoa Cái Cư Phu Thê (華蓋夫妻宮)**: B3 catalog required_stars incorrectly lists Hóa Kỵ while pattern name and source refer to Hoa Cái. This is a catalog inconsistency, even without historical named-pattern confirmation. Source: https://tracuutuvi.com/hoa-cai-cung-phu-the.html
- **Lưỡng Trùng Thiên Mã (兩重天祿天馬)**: Two Lộc + one Mã != two Thiên Mã; keep NAME_MISMATCH and separate possible 疊馬/流馬 concepts. Source: https://ichingtrilogy.com/post/tian-ma-xing/ ; https://www.ziweitai.com/topic/lucunxing
- **Tài Ấn Giao Trì (財印交馳)**: Modern label found but snippet omits Mệnh and Thiên Tướng. Do not claim a Vũ Tướng 同宮 rule based on that snippet. Source: https://www.xuanjige.app/articles/tianxiang-qianyi
- **Khúc Ám Đồng Cung (文曲巨門同宮)**: The readable line supports Văn Khúc+Cự Môn đồng cung only; not meeting-by-aspect or exact historic title. Source: https://hocvienlyso.org/chuong-20-van-xuong-van-khuc.html

## Adjudication rubric

1. Store evidence as per-source claims, not as an undifferentiated composite sentence. Never fill gaps with model memory.
2. Verify retrieval, exact text, heading, URL/revision, position within work, and edition type; only then produce source digest.
3. Separate `identity` (exact named historical cách?), `formation` (structural predicates), `nobleGrade` (strengthening), `breaking` (invalidation), and `interpretation`.
4. One independent review per model for each **new** source claim. Preserve old reviews. Allow `DOCUMENTED_SCHOOL_VARIANT` / `SOURCE_CONTRADICTION` as successful research disposition; do not require `AI_ACCEPTED`.
5. Check astronomy/star-placement relationships (e.g. some star co-locations only occur in certain branches) independently in star-placement code; label them derived, not quoted.
6. Caution with old fatalistic language; record as historical assertions, never return medical/death forecasts to users.
7. Sprint 9 cannot be called 100% source-verified while PDF pages and identities remain unauthenticated. Keep owner-requested Sprint open and report blockers, without fabricating proof.
