import {
    Sticker
} from 'wa-sticker-formatter'

var handler = async (m, { conn, text }) => {
    if (!text) {
        m.reply('Masukan teks')
        return
    }

    try {
        const emojis = text.match(/[\p{Emoji}\uFE0F-\uFFFF]/gu);
        let emojiText = emojis ? emojis.join('') : '';
        const maxTextLength = 151 - emojiText.length; // Mengurangi panjang emoji dari batas teks
        let clippedText = text.substring(0, maxTextLength);

        let req = `https://brat.caliphdev.com/api/brat?text=${encodeURIComponent(clippedText)}`
        let stiker = await createSticker(req)
        await conn.sendFile(m.chat, stiker, '', '', m, '')
    } catch (e) {
        console.log(e)
    }
}

handler.command = handler.help = ['brat']
handler.tags = ['sticker']
handler.limit = true;

export default handler;

async function createSticker(img, url) {
    // Menghapus pack dan author agar tidak ada watermark
    let stickerMetadata = {
        type: 'full',
        quality: 100 // Anda bisa atur kualitas jika diinginkan
    }
    return (new Sticker(img ? img : url, stickerMetadata)).toBuffer()
}