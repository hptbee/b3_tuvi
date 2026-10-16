# Independent T026 candidate fixture/source-scope check

Status: independently replayed engineering witnesses; **no interpretation/source approval**, no public release or authenticated historical edition claim. No product writes and no T025 packet changes.

Read the complete candidate report `/tmp/t019-next.md`, candidate JSON, target span and the complete Juan3 紫微 subsection (including heading/brightness line and every preceding/following verse until next 天府 heading). Exact UTF8 span SHA256 `bac2c2992bfbd705187c18fffffd7e7f819de053ecb9e227e01cb3b6122e0c87` and complete-context SHA256 `750f2cb32f124562bb12608eeebe485ad6f3fe3d9ecd5122aa70ce1984f2f537` independently match the candidate; context includes the complete target line.

Target: `紫微輔弼同宮一呼百諾居上品 或作三方為次吉，在財帛宮則為財賦之官。`

## Actual independent reproduction

Ran `/tmp/t026-independent-replay.mjs` using existing `solarToLunar → hourBranchIndex → calculateTuVi → normalizeChart`, then an independently constructed same_palace AST for Tài Bạch containing Tử Vi/Tả Phù/Hữu Bật, and an independent direct canonical-star set predicate. No candidate or new product interpretation gate was used as expected oracle. All nine supplied solar inputs reproduced exact lunar metadata, Cục, Mệnh, anSaoMonth, all four supplied relevant normalized palace star arrays, expected boolean and existing evaluator satisfied/not_satisfied trace. All charts remained byte-equivalent before/after predicate evaluation.

Results: **3 positive, 6 negative, 9/9 matching**. Positives are 1981-10-28h12, 1983-11-08h12 and 1984-05-08h12 (gender1). Real target hosts contain Tử Vi/Tả/Hữu in all three. Both first positives have Sửu target, third Mùi. All three also contain Phá Quân; 1983 additionally contains Kình Dương, showing these are not adverse-free/general-favorable witnesses.

Negatives discriminate:

- 1980-02-08h12 and1980-02-22h12: Tử Vi+Tả present at Tài, Hữu absent. Thus they discriminate Hữu necessity, but **both test the same omitted auxiliary**.
- 1980-05-15h12 and1980-05-22h12: Tả+Hữu present at Tài, Tử Vi absent.
- 1980-11-22h20 and1981-11-08h20: all three are cohosted in Mệnh rather than Tài. Target contains none. These distinguish a wrong-host/global triple from target-specific matching, but do not separately test a Tài one-auxiliary plus outside other-auxiliary variant.

**Material fixture gap fixed independently before model review:** original nine lack a Hữu-present/Tả-absent target negative, so an accidentally omitted Tả condition could pass all nine. A separate real-chart search found this after233 examined inputs: **28 April1980 at hour8, gender1**. At Tài Bạch, Tử Vi and Hữu Bật are present, Tả Phù absent; both direct predicate and existing AST return false. Full input/lunar/host/stars/trace are in `additionalMissingTaFixture` in JSON. Add this tenth witness to the source-review packet *before* reviews (not as a post-approval patch). This is an engineering regression witness, not a source golden.

Machine-readable actual output: `/tmp/t026-independent-fixtures.json`. Reproduce with `node /tmp/t026-independent-replay.mjs`.

## Material semantic risks for actual independent source reviewers

1. The punctuation places `在財帛宮則為財賦之官` after the alternate `或作三方為次吉`. Reviewers must independently decide whether the 財帛 branch unambiguously includes direct 同宮 as a sufficient narrow subset, or grammatically belongs only to the 三方 alternative. Do not repair ambiguity by deleting `或作三方為次吉`, or approve exact same-palace logic only because it is reachable.
2. `輔弼` is a paired traditional term. Requiring *both* named Tả/Hữu is conservative and independently testable, but reviewers still must validate that reading and the normalized mapping; no OR or generic benefic substitution is authorized.
3. The complete subsection begins with branch-specific brightness, and other separate verses add adverse/忌/吉 qualifications. This candidate line itself states no explicit adverse absence or brightness threshold. Reviewers must decide whether a source-wide qualification actually governs it; neither an adverse-free rule nor a claim that adverse stars never matter may be invented. Positive with Kình Dương demonstrates the modeled paragraph-scoped predicate is not a full-chart synthesis.
4. All supplied positives include Tử Vi+Phá Quân, and nearby lines separately discuss 紫微破軍 and 紫破. The source annotation must not become an unqualified wealth/career prediction or rank. Exact same-palace annotation can coexist only if actual source reviewers accept the narrow scope in complete context. Internal output should retain traditional attribution and no-verified-real-world-fact wording.
5. `財賦之官` can be translated conservatively as an image of treasury/fiscal office. It does not establish actual profession, rank, material wealth, management skill or career success. Any narrower Vietnamese wording must be reviewed exactly, digest-bound and withheld from public prose.
6. The mirror is a modern pinned transcription. Matching existing raw HTML hash establishes artifact identity, not historical authentication or original Quanshu correctness. No generic VCD 正曜 taxonomy, classical fortune placement, prior Tử–Phủ rule, or public permission follows.

Source ambiguity is deliberately unresolved by this fixture check; a negative dual-model verdict remains a legitimate result. Fixtures demonstrate executable reachability and condition discrimination only.
