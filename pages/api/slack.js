import Cors from 'cors';
import { WebClient } from '@slack/web-api';
import { getDate } from 'date-fns'

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, result => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

function getMessage(array) {
  const time = Math.floor(getDate(new Date()) / 1000) + 3;
  const selectedIdx = time % array.length;
  return array[1];
}

const cors = new Cors({
  methods: ['GET']
});

const token = process.env.TOKEN;
const conversationId = process.env.CHANNEL_ID;
const slack = new WebClient(token);

const messages = [
  'Hi @accom-web-eng daily slackup time ! Please log your activities in this thread',
  'Hi @accom-web-eng sudah hampir 3 tahun gw jadi lead kalian, gw minta maaf sebesar-besarnya kalau ada yang salah. Mudah mudahan kita bisa ketemu lagi setelah corona padam. dengan breat hati gw sampaikan gw ulang tahun hari ini. TOLONG DONG DIUCAPIN SELAMAT DONG!! Kalau mau traktir gw bisa kirim gofood ke alamat ini : Bassura City Apartment Tower Edelweiss, Unit E/17/BG, JI. Jend. Basuki Rachmat Blok Al Abror No. 45 RT8/RW10 Jatinegara, Jakarta Timur, 13410 DKI Jakarta ditunggu loh. jangan lupa laporan hari ini ngapain aja di thread ini guys !!',
  'Sebagai bos, saya mau minta laporan kalian hari ini ngapain aja. KERJA WOI !!! @accom-web-eng, pecut nih !',
  'Ayo @accom-web-eng, ngapain aja hari ini ?',
  'Gw udah masuk kantor kok kalian gak ada ? coba seharian ini kalian ngapaain aja ? @accom-web-eng',
  'Mana nih kok sepi, laporan harian dulu guys ! @accom-web-eng',
  'Laporan dulu sini @accom-web-eng',
  'Log your activities in this thread ya @accom-web-eng',
]

async function handler(req, res){
  await runMiddleware(req, res, cors);
  await slack.chat.postMessage({
    channel: conversationId,
    text: getMessage(messages),
    link_names: true
  });
  return res.json({ status: 'success', body : req.body });
};

export default handler;