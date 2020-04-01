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
  return array[0];
}

const cors = new Cors({
  methods: ['GET']
});

const token = process.env.TOKEN;
const conversationId = process.env.CHANNEL_ID;
const slack = new WebClient(token);

const messages = [
  'Hi @accom-web-eng daily slackup time ! Please log your activities in this thread',
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