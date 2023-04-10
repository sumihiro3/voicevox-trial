<template>
  <main class="ma-10">
    <h1>Welcome to VOICEVOX Trial!!</h1>

    <form>
      <VRow class="ma-6">
        <VCol cols="12">
          <label for="inputText"> 音声合成したい文章を入力してください </label>
          <VTextarea id="inputText" v-model="inputText" />
        </VCol>
        <VCol cols="12">
          <label for="speakerSelect">
            発話するキャラクターを選択してください
          </label>
          <VSelect
            id="speakerSelect"
            v-model="speaker"
            :items="speakerList"
            item-title="name"
            item-value="value"
          />
        </VCol>
        <VCol cols="12">
          <VBtn
            :loading="voiceCreating"
            color="primary"
            @click="createQuery"
            class="ma-4"
          >
            音声合成開始
          </VBtn>
          <VBtn
            :disabled="voiceCreating"
            color="blue-grey"
            @click="resetForm"
            class="ma-4"
          >
            リセット
          </VBtn>
        </VCol>
        <VCol cols="12" v-if="audioData && audioSrc">
          <h2>合成された音声データを再生</h2>
          <audio controls autoplay :src="audioSrc"></audio>
        </VCol>
      </VRow>
    </form>
    <i> VOICEVOX を利用して構築しています </i>
  </main>
</template>

<script setup lang="ts">
import superagent from 'superagent';
import { Query } from '../types';

const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public.API_BASE_URL as string;

const initialText = 'おまたせしました！';
const initialSpeaker = 1;
const inputText = ref<string>(initialText);
const speaker = ref<number>(initialSpeaker);

const voiceCreating = ref<boolean>(false);
const query = ref<Query | null>(null);
const audioData = ref<Blob | null>(null);
const audioSrc = ref<string | null>(null);

const speakerList = [
  { name: 'ずんだもん：あまあま', value: 1 },
  { name: 'ずんだもん：ノーマル', value: 3 },
  { name: '四国めたん：ノーマル', value: 2 },
  { name: '春日部つむぎ：ノーマル', value: 8 },
  { name: '波音リツ：ノーマル', value: 9 },
  { name: '雨晴はう：ノーマル', value: 10 },
  { name: '玄野武宏：ノーマル', value: 11 },
  { name: '白上虎太郎：ノーマル', value: 12 },
  { name: '青山龍星：ノーマル', value: 13 },
  { name: '冥鳴ひまり：ノーマル', value: 14 },
  { name: '九州そら：ツンツン', value: 18 },
  { name: '九州そら：ノーマル', value: 16 },
];

/**
 * 入力された文字列からQueryを作り出す
 */
const createQuery = async () => {
  try {
    voiceCreating.value = true;
    const res = await superagent
      .post(`${baseUrl}/audio_query`)
      .query({ speaker: speaker.value, text: inputText.value });
    if (!res) {
      resetForm();
      return;
    }
    query.value = res.body as Query;
    console.log(`Response: ${JSON.stringify(query.value)}`);
    // Query が返ってきたら音声合成を開始
    await createVoice();
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      console.error(error.message);
    }
    resetForm();
  }
};

/**
 * 生成された Query を基に音声合成する
 */
const createVoice = async () => {
  console.log(`createVoice called!`);
  if (!query.value) {
    resetForm();
    return;
  }
  try {
    console.log(`Creating voice...`);
    const res = await superagent
      .post(`${baseUrl}/synthesis`)
      .query({ speaker: speaker.value })
      .send(query.value)
      .responseType('blob');
    console.log(`Voice created!`);

    if (!res) {
      resetForm();
      return;
    }
    // 音声データを audio タグに設定して再生する
    audioData.value = res.body as Blob;
    audioSrc.value = window.URL.createObjectURL(audioData.value);
    voiceCreating.value = false;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      console.error(error.message);
    }
    resetForm();
  }
};

/**
 * フォームの入力値を初期化する
 */
const resetForm = () => {
  inputText.value = initialText;
  speaker.value = initialSpeaker;
  query.value = null;
  audioData.value = null;
  audioSrc.value = null;
  voiceCreating.value = false;
};
</script>
