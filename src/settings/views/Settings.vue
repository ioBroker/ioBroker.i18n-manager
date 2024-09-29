<template>
  <v-dialog
    v-model="visible"
    fullscreen
    @close="hideSettings"
  >
    <v-form
      v-model="isFormValid"
      @submit.prevent="handleSubmit"
      class="settings-form"
    >
      <v-card class="settings">
        <v-card-title primary-title>
          <v-btn
            icon
            class="mr-2"
            @click="hideSettings"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          Settings
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col class="px-5 pb-3">
              <v-text-field
                v-model="settings.spacesIndentation"
                label="Spaces indentation"
                :rules="spaceSizeRules"
                outlined
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="px-5 pb-3">
              <v-select
                v-model="settings.translationEngine"
                label="Translation Engine"
                :items="['google', 'deepl', 'aws', 'iobroker']"
                hide-details
                outlined
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="px-5 pb-3">
              <v-text-field
                v-model="settings.googleTranslateApiKey"
                label="Google Translate™ API Key"
                hide-details
                outlined
              />
            </v-col>
          </v-row>
          <div class="px-2">
            <RemoteLink href="https://console.cloud.google.com/apis/credentials/wizard?api=translate.googleapis.com" />
          </div>
          <v-row>
            <v-col class="px-5 pb-3">
              <v-text-field
                v-model="settings.deepLTranslateApiKey"
                label="DeepL translate API Key"
                hide-details
                outlined
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="px-5 pb-3">
              <v-text-field
                v-model="settings.awsTranslateApiKey"
                label="AWS Translate API Key"
                hide-details
                outlined
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="px-5 pb-3">
              <v-text-field
                v-model="settings.iobrokerTranslateApiKey"
                label="ioBroker translate API Key"
                hide-details
                outlined
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col class="px-5 pb-3">
              <v-text-field
                v-model="settings.translationFrom"
                label="translation from"
                hide-details
                outlined
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-spacer />

        <v-card-actions>
          <v-spacer />
          <v-btn
            @click="hideSettings"
            text
          >Cancel</v-btn>
          <v-btn
            :disabled="!isFormValid"
            type="submit"
            color="primary"
            class="ml-4"
          >Save</v-btn>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>

<script lang="ts">
import { useNamespace } from '@/store/utils';
import { CustomSettings } from '@common/types';
import { defineComponent, watch } from '@vue/composition-api';
import RemoteLink from '@/components/RemoteLink.vue';

export default defineComponent({
  name: 'Settings',
  components: {
    RemoteLink,
  },
  setup() {
    const globalModule = useNamespace('global');
    const visible = globalModule.useState<boolean>('isSettingsVisible');
    const hideSettings = globalModule.useMutation('hideSettings');

    const settingsModule = useNamespace('settings');
    const settings = settingsModule.useState<CustomSettings>('settings', { immediate: true });
    const saveSettings = settingsModule.useAction('saveSettings');

    const folderModule = useNamespace('folder');
    const refreshTranslationKey = folderModule.useAction('refreshTranslationKey');

    const spaceSizeRules = [
      (v: any) => !!v || 'This field is mandatory',
      (v: any) => (v && !isNaN(parseInt(v, 10))) || 'Enter a number',
      (v: any) => (v && parseInt(v, 10) <= 10) || 'Tab size should be max 10',
      (v: any) => (v && parseInt(v, 10) > 0) || 'Tab size should be above 1',
    ];

    const isFormValid = false;

    async function handleSubmit() {
      await saveSettings(settings.value);
      await refreshTranslationKey();
    }

    // Synchronize when the dialog is closed using ESC key
    watch(visible, () => {
      if (!visible.value) hideSettings();
    });

    return {
      visible,
      settings,
      hideSettings,
      handleSubmit,
      spaceSizeRules,
      isFormValid,
    };
  },
});
</script>

<style scoped lang="scss">
.settings {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.settings-form {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
