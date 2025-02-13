let cooldown = new Map();

let handler = async (m, { conn, command, args }) => {
    let userId = m.sender; // Hanya berlaku untuk pengguna yang mengetik command
    let users = global.db.data.users;

    if (!users[userId]) throw 'User tidak ditemukan di database!';
    
    let jum = args[0] ? parseInt(args[0]) : 1000; // Default jumlah jika tidak ada argumen
    if (isNaN(jum)) throw 'Jumlah harus berupa angka!';
    if (jum > 1e94) throw 'Jumlah terlalu besar! Maksimal 1e94, agar sistem bot tidak MaxOut/Kelebihan Kapasitas.';
    
    // Cek cooldown
    if (cooldown.has(userId)) {
        let lastUsed = cooldown.get(userId);
        let now = Date.now();
        let remaining = 25000 - (now - lastUsed); // 25 detik dalam milidetik
        if (remaining > 0) {
            throw `Harap tunggu ${Math.ceil(remaining / 1000)} detik agar bot bisa memproses command sebelumnya.`;
        }
    }
    
    users[userId].chip += jum; // Tambahkan uang ke pengguna
    conn.reply(m.chat, `Sukses menambah chip sebanyak ${jum}.`, m);

    // Set cooldown
    cooldown.set(userId, Date.now());
    setTimeout(() => cooldown.delete(userId), 25000); // Hapus cooldown setelah 25 detik
};

handler.help = ['addchip'];
handler.tags = ['premium'];
handler.command = /^addchip$/i;
handler.premium = true;

export default handler;