let handler = async (m, { conn, text, usedPrefix, command }) => {
    conn.listAfk = conn.listAfk || {};

    try {
        const user = global.db.data.users[m.sender];
        user.afk = +new Date();
        user.afkReason = text;
        
        const username = m.name || m.pushName;
        const id = m.sender || m.key.remoteJid;

        // Menambahkan user ke dalam daftar AFK chat jika belum ada
        conn.listAfk[m.chat] = conn.listAfk[m.chat]
            ? conn.listAfk[m.chat].some(user => user.id === id)
                ? conn.listAfk[m.chat]
                : [...conn.listAfk[m.chat], { username, id }]
            : [{ username, id }];
        
        // Membuat pesan untuk memberitahukan status AFK
        const caption = `
🚀 *${username}* (@${m.sender.split("@")[0]}) sekarang sedang AFK!

*Alasan AFK:* ${text ? text : 'Tanpa alasan'}

Kembali secepatnya!
        `;
        
        // Mengirimkan pesan dengan informasi tambahan
        await conn.reply(m.chat, caption, null, {
            contextInfo: {
                mentionedJid: [m.sender],
                externalAdReply: {
                    title: "Status AFK Dimulai",
                    body: "Harap tunggu hingga mereka kembali",
                    thumbnail: await (await conn.getFile("https://cdn-icons-png.flaticon.com/128/742/742927.png")).data,
                },
            },
        });
    } catch (error) {
        console.error(error);
    }
};

handler.help = ['afk [alasan]'];
handler.tags = ['main'];
handler.group = true;
handler.command = /^afk$/i;

export default handler;