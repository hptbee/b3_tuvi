import { createHash } from 'crypto';

export function sha256Text(value) {
    return createHash('sha256').update(value).digest('hex');
}

export function assessSourceBinding({ fileBytes = null, declaredFileSha256 = null, span = '' } = {}) {
    const passageDigest = sha256Text(typeof span === 'string' ? span : '');
    if (fileBytes == null) {
        return {
            passageDigest,
            fileHashMatches: null,
            pdfTextChecked: false,
            binding: 'passage_hash_only'
        };
    }
    const actual = sha256Text(fileBytes);
    const fileHashMatches = actual === declaredFileSha256;
    return {
        passageDigest,
        fileHashMatches,
        pdfTextChecked: false,
        binding: fileHashMatches ? 'file_hash_checked' : 'file_hash_mismatch'
    };
}

export function quoteOnPage(pageText, quotation) {
    const page = typeof pageText === 'string' ? pageText : '';
    const quote = typeof quotation === 'string' ? quotation : '';
    const found = quote.length >= 4 && page.includes(quote);
    return {
        pdfTextChecked: true,
        quotationOnPage: found,
        binding: found ? 'pdf_page_checked' : 'pdf_page_mismatch'
    };
}
