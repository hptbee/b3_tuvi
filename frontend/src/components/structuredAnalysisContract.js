// Shared HTTP response contract: used by the production component and Node integration tests.
const PALACE_LABELS = {
  menh: 'Mệnh',
  phu_mau: 'Phụ mẫu',
  phuc_duc: 'Phúc đức',
  dien_trach: 'Điền trạch',
  quan_loc: 'Quan lộc',
  no_boc: 'Nô bộc',
  thien_di: 'Thiên di',
  tat_ach: 'Tật ách',
  tai_bach: 'Tài bạch',
  tu_tuc: 'Tử tức',
  phu_the: 'Phu thê',
  huynh_de: 'Huynh đệ'
};

const YEAR_BRANCHES = ['Tí', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tị', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const MINOR_PROFILE = 'iztro-pinned-age1-sex-triad';
const MINOR_SOURCE = 'iztro-modern-software';
const MINOR_PIN = '2f00e2ab0c80b1632e55bc362f2ae26e121245cb';
const MINOR_COMPATIBILITY = 'branch_sex_age_projection_not_full_iztro_astrolabe';
const MAJOR_PROFILE = 'iztro-pinned-menh-cuc-decadal';
const MAJOR_STEM_PROFILE = 'iztro-pinned-menh-cuc-decadal-stem';
const MAJOR_MUTAGEN_PROFILE = 'iztro-pinned-menh-cuc-decadal-mutagen';
const MAJOR_PROFILES = [MAJOR_PROFILE, MAJOR_STEM_PROFILE, MAJOR_MUTAGEN_PROFILE];
const MAJOR_MUTAGEN_COMPATIBILITY = 'server_natal_menh_cuc_stem_branch_sex_age_and_default_mutagen_projection_not_full_iztro_astrolabe';
const MUTAGEN_LABELS = { hoa_loc: 'Hóa Lộc', hoa_quyen: 'Hóa Quyền', hoa_khoa: 'Hóa Khoa', hoa_ky: 'Hóa Kỵ' };
// Canonical identity validation only; the approved 40-cell formula stays on the server.
const MUTAGEN_SOURCE_STARS = {
  cu_mon: 'Cự Môn', liem_trinh: 'Liêm Trinh', pha_quan: 'Phá Quân', thai_duong: 'Thái Dương',
  thai_am: 'Thái Âm', tham_lang: 'Tham Lang', thien_co: 'Thiên Cơ', thien_luong: 'Thiên Lương',
  thien_dong: 'Thiên Đồng', van_xuong: 'Văn Xương', van_khuc: 'Văn Khúc', vu_khuc: 'Vũ Khúc',
  huu_bat: 'Hữu Bật', tu_vi: 'Tử Vi', ta_phu: 'Tả Phù'
};
const MUTAGEN_ROW_KEYS = ['mutagenId', 'mutagenLabel', 'sourceStarId', 'sourceStarName', 'palaceId', 'functionId', 'functionLabel'];
const HEAVENLY_STEMS = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
const MAJOR_STEM_COMPATIBILITY = 'server_natal_menh_cuc_stem_branch_sex_age_projection_not_full_iztro_astrolabe';
const MAJOR_COMPATIBILITY = 'server_natal_menh_cuc_branch_sex_age_projection_not_full_iztro_astrolabe';
function validMinorResponse(body, option) {
  const cap = body.time?.capabilities?.tieu_han_modern;
  if (cap === undefined) return option === null;
  if (!cap || typeof cap !== 'object' || cap.id !== 'tieu_han_modern'
    || cap.publicFortune !== false || cap.interpretation !== null || cap.interpretationStatus !== 'blocked') return false;
  const emptyPlacement = cap.branch === null && cap.palaceId === null
    && cap.functionId === null && cap.functionLabel === null;
  if (!option) return cap.status === 'not_applied'
    && cap.reason === 'missing_explicit_profile_and_nominal_age'
    && cap.profile === null && cap.nominalAge === null
    && cap.palaceMapping === 'not_applied' && cap.branchPlacement === 'not_applied' && emptyPlacement;
  if (cap.profile !== option.profile || cap.nominalAge !== option.nominalAge
    || cap.sourceId !== MINOR_SOURCE || cap.sourcePin !== MINOR_PIN
    || cap.ageInput !== 'caller_supplied' || cap.ageDerivation !== 'not_applied'
    || cap.calendarCompatibility !== MINOR_COMPATIBILITY) return false;
  if (cap.status === 'blocked') return ['modern_profile_not_approved', 'invalid_chart'].includes(cap.reason)
    && cap.palaceMapping === 'not_applied' && emptyPlacement;
  if (cap.status !== 'branch_placed' || cap.branchPlacement !== 'supported' || cap.palaceMapping !== 'mapped'
    || !YEAR_BRANCHES.includes(cap.branch) || cap.palaceId !== String(YEAR_BRANCHES.indexOf(cap.branch) + 1)
    || !Object.hasOwn(PALACE_LABELS, cap.functionId)
    || cap.functionLabel !== PALACE_LABELS[cap.functionId].toLocaleUpperCase('vi')) return false;
  return body.statements.filter(statement => !statement.thanOverlay
    && statement.palaceId === cap.palaceId && statement.functionId === cap.functionId).length === 1;
}

// API statement labels may carry a known brightness suffix; identity stays canonical.
function sourceStarDisplayName(name) {
  return typeof name === 'string' ? name.replace(/ \([MVĐBH]\)$/, '') : name;
}

function validMutagenPlacement(body, cap) {
  if (cap.mutagenScope !== 'natal_physical_palaces' || cap.mutagenPlacement !== 'supported'
    || !Array.isArray(cap.mutagens) || cap.mutagens.length !== 4
    || new Set(cap.mutagens.map(row => row?.sourceStarId)).size !== 4) return false;
  const physical = body.statements.filter(statement => !statement.thanOverlay);
  return cap.mutagens.every((row, index) => {
    if (!row || typeof row !== 'object' || Object.keys(row).length !== MUTAGEN_ROW_KEYS.length
      || !MUTAGEN_ROW_KEYS.every(key => Object.hasOwn(row, key))
      || row.mutagenId !== Object.keys(MUTAGEN_LABELS)[index] || row.mutagenLabel !== MUTAGEN_LABELS[row.mutagenId]
      || !Object.hasOwn(MUTAGEN_SOURCE_STARS, row.sourceStarId) || row.sourceStarName !== MUTAGEN_SOURCE_STARS[row.sourceStarId]
      || typeof row.palaceId !== 'string' || !/^(?:[1-9]|1[0-2])$/.test(row.palaceId)
      || !Object.hasOwn(PALACE_LABELS, row.functionId)
      || row.functionLabel !== PALACE_LABELS[row.functionId].toLocaleUpperCase('vi')) return false;
    const origins = physical.filter(statement => statement.palaceId === row.palaceId && statement.functionId === row.functionId);
    if (origins.length !== 1 || physical.filter(statement => statement.palaceId === row.palaceId).length !== 1) return false;
    const occurrences = physical.flatMap(statement => (statement.stars || [])
      .filter(star => star.starId === row.sourceStarId || sourceStarDisplayName(star.displayName) === row.sourceStarName)
      .map(star => ({ statement, star })));
    return occurrences.length === 1 && occurrences[0].statement === origins[0]
      && occurrences[0].star.starId === row.sourceStarId && sourceStarDisplayName(occurrences[0].star.displayName) === row.sourceStarName;
  });
}

function validMajorResponse(body, option) {
  const cap = body.time?.capabilities?.dai_han_modern;
  const withMutagens = option?.profile === MAJOR_MUTAGEN_PROFILE;
  const withStem = option?.profile === MAJOR_STEM_PROFILE || withMutagens;
  if (option && !MAJOR_PROFILES.includes(option.profile)) return false;
  if (cap && !withMutagens && ['mutagenScope', 'mutagenPlacement', 'mutagens'].some(key => Object.hasOwn(cap, key))) return false;
  if (cap && !withStem && (Object.hasOwn(cap, 'heavenlyStem') || Object.hasOwn(cap, 'stemPlacement'))) return false;
  if (cap === undefined) return option === null;
  if (!cap || typeof cap !== 'object' || cap.id !== 'dai_han_modern'
    || cap.publicFortune !== false || cap.interpretation !== null || cap.interpretationStatus !== 'blocked'
    || cap.sourceId !== MINOR_SOURCE || cap.sourcePin !== MINOR_PIN
    || cap.ageInput !== 'caller_supplied' || cap.ageDerivation !== 'not_applied'
    || cap.calendarCompatibility !== (withMutagens ? MAJOR_MUTAGEN_COMPATIBILITY : withStem ? MAJOR_STEM_COMPATIBILITY : MAJOR_COMPATIBILITY)) return false;
  const emptyPlacement = cap.branch === null && cap.palaceId === null
    && cap.functionId === null && cap.functionLabel === null
    && cap.decadeIndex === null && cap.decadeStartAge === null && cap.decadeEndAge === null;
  const closed = emptyPlacement && cap.branchPlacement === 'not_applied'
    && (!withStem || (cap.heavenlyStem === null && cap.stemPlacement === 'not_applied'))
    && (!withMutagens || (cap.mutagenScope === 'natal_physical_palaces' && cap.mutagenPlacement === 'not_applied'
      && Array.isArray(cap.mutagens) && cap.mutagens.length === 0));
  if (!option) return cap.status === 'not_applied'
    && cap.reason === 'missing_explicit_profile_and_nominal_age'
    && cap.profile === null && cap.nominalAge === null && cap.palaceMapping === 'not_applied' && closed;
  if (cap.profile !== option.profile || cap.nominalAge !== option.nominalAge) return false;
  if (cap.status === 'blocked') return closed && (
    ((cap.reason === 'modern_profile_not_approved' || (withStem && cap.reason === 'modern_stem_profile_not_approved') || (withMutagens && cap.reason === 'modern_mutagen_profile_not_approved')) && cap.palaceMapping === 'not_applied')
    || (cap.reason === 'invalid_chart' && cap.palaceMapping === 'invalid_chart'));
  if (cap.status === 'not_applied') return closed && cap.palaceMapping === 'not_applied'
    && ((cap.reason === 'before_first_period' && option.nominalAge < 6)
      || (cap.reason === 'after_last_period' && option.nominalAge > 121));
  if ((withStem && (!HEAVENLY_STEMS.includes(cap.heavenlyStem) || cap.stemPlacement !== 'supported'))
    || cap.status !== 'branch_placed' || cap.reason !== null
    || cap.branchPlacement !== 'supported' || cap.palaceMapping !== 'mapped'
    || !YEAR_BRANCHES.includes(cap.branch) || cap.palaceId !== String(YEAR_BRANCHES.indexOf(cap.branch) + 1)
    || !Object.hasOwn(PALACE_LABELS, cap.functionId)
    || cap.functionLabel !== PALACE_LABELS[cap.functionId].toLocaleUpperCase('vi')
    || !Number.isInteger(cap.decadeIndex) || cap.decadeIndex < 0 || cap.decadeIndex > 11
    || !Number.isInteger(cap.decadeStartAge) || !Number.isInteger(cap.decadeEndAge)
    || cap.decadeEndAge !== cap.decadeStartAge + 9
    || cap.decadeStartAge - 10 * cap.decadeIndex < 2 || cap.decadeStartAge - 10 * cap.decadeIndex > 6
    || option.nominalAge < cap.decadeStartAge || option.nominalAge > cap.decadeEndAge) return false;
  return (!withMutagens || validMutagenPlacement(body, cap)) && body.statements.filter(statement => !statement.thanOverlay
    && statement.palaceId === cap.palaceId && statement.functionId === cap.functionId).length === 1;
}

function boundedString(value, max) {
  return typeof value === 'string' && value.length > 0 && value.length <= max;
}

function validStringList(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function validStatement(statement) {
  if (!statement || typeof statement !== 'object') return false;
  if (!boundedString(statement.statementId, 200) || !boundedString(statement.functionId, 200)) return false;
  if (!boundedString(statement.availabilityStatus, 1000)) return false;
  if (statement.stars !== undefined) {
    if (!Array.isArray(statement.stars)) return false;
    if (!statement.stars.every((star) => (
      star
      && typeof star === 'object'
      && (star.displayName === undefined || typeof star.displayName === 'string')
      && (star.starId === undefined || typeof star.starId === 'string')
      && (star.brightness === undefined || star.brightness === null || typeof star.brightness === 'string')
      && (star.displayName || star.starId)
    ))) return false;
  }
  if (statement.relations !== undefined) {
    const { relations } = statement;
    if (!relations || typeof relations !== 'object') return false;
    if (relations.tamHop !== undefined && !Array.isArray(relations.tamHop)) return false;
    if (relations.xungChieu !== undefined && relations.xungChieu !== null && typeof relations.xungChieu !== 'number') return false;
  }
  if (statement.ruleEvidence !== undefined) {
    if (!Array.isArray(statement.ruleEvidence)) return false;
    if (!statement.ruleEvidence.every((item) => item && typeof item === 'object' && boundedString(item.ruleId, 500))) return false;
  }
  if (statement.claimApplicability !== undefined) {
    if (!Array.isArray(statement.claimApplicability)) return false;
    if (!statement.claimApplicability.every((item) => {
      if (!item || typeof item !== 'object' || !boundedString(item.claimId, 200)) return false;
      if (item.reasons !== undefined && !validStringList(item.reasons)) return false;
      if (item.layers !== undefined) {
        if (!item.layers || typeof item.layers !== 'object') return false;
        if (!Object.values(item.layers).every((layer) => typeof layer === 'string')) return false;
      }
      return true;
    })) return false;
  }
  if (statement.sourceReferences !== undefined) {
    if (!Array.isArray(statement.sourceReferences)) return false;
    if (!statement.sourceReferences.every((item) => (
      item && typeof item === 'object' && (item.sourceId === undefined || typeof item.sourceId === 'string')
    ))) return false;
  }
  if (statement.contradictoryEvidence !== undefined) {
    if (!Array.isArray(statement.contradictoryEvidence)) return false;
    if (!statement.contradictoryEvidence.every((item) => item && typeof item === 'object')) return false;
  }
  return true;
}

function validAnalysisBody(body) {
  if (!body || typeof body !== 'object') return false;
  if (!Array.isArray(body.statements) || !body.statements.every(validStatement)) return false;
  const capabilities = body.time?.capabilities;
  if (capabilities !== undefined) {
    if (!capabilities || typeof capabilities !== 'object') return false;
    if (!Object.values(capabilities).every((value) => {
      if (!value || typeof value !== 'object') return false;
      if (value.branch !== undefined && value.branch !== null && typeof value.branch !== 'string') return false;
      if (value.status !== undefined && typeof value.status !== 'string') return false;
      if (value.palaceMapping !== undefined) {
        if (!['mapped', 'invalid_chart', 'not_applied'].includes(value.palaceMapping)) return false;
        if (value.palaceMapping === 'mapped' && (
          value.status !== 'branch_placed'
          || typeof value.palaceId !== 'string'
          || !/^(?:[1-9]|1[0-2])$/.test(value.palaceId)
          || YEAR_BRANCHES[Number(value.palaceId) - 1] !== value.branch
          || typeof value.functionId !== 'string'
          || !Object.hasOwn(PALACE_LABELS, value.functionId)
        )) return false;
      }
      return true;
    })) return false;
  }
  return true;
}

export {
  PALACE_LABELS, YEAR_BRANCHES, MINOR_PROFILE, MINOR_PIN,
  MAJOR_PROFILE, MAJOR_STEM_PROFILE, MAJOR_MUTAGEN_PROFILE, MAJOR_PROFILES,
  validAnalysisBody, validMinorResponse, validMajorResponse
};
