<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header>Translate</v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col>
            <v-autocomplete
              label="From"
              v-model="settings.translationFrom"
              v-on:change="handleChange"
              :items="languageList"
              item-disabled="disabled"
              item-text="label"
              item-value="language"
              class="source"
              outlined
              dense
              hide-details
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="10" class="pb-0">
            <v-autocomplete
              label="To"
              v-model="settings.translationTo"
              v-on:change="handleChange"
              :items="languageList"
              item-disabled="disabled"
              item-text="label"
              item-value="language"
              class="targets"
              outlined
              multiple
              dense
              small-chips
              deletable-chips
              counter
              clearable
            />
          </v-col>
          <v-col cols="2" class="pb-0">
            <v-btn @click="selectAll" class="select-all" outlined>All</v-btn>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="3" class="pt-0">
            <v-radio-group v-model="mode">
              <v-radio label="This Key" value="this" :disabled="!selectedItem" />
              <v-radio label="All Keys" value="all" class="all-keys" />
            </v-radio-group>
          </v-col>
          <v-col cols="4" class="pt-0">
            <v-checkbox label="Overwrite not empty fields" v-model="overwrite" />
          </v-col>
          <v-col class="pt-0">
            <v-btn v-if="isTranslationEnabled" color="primary" @click="translate">
              Translate
            </v-btn>
            <v-btn v-if="!isTranslationEnabled" color="error" @click="$emit('showSettings')">
              Configure Google Translate™
            </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-btn v-if="isTranslationEnabled" color="primary" @click="translate">
      Translate
    </v-btn>
  </v-expansion-panels>
</template>

<script lang="ts">
  import { defineComponent, ref, watch } from '@vue/composition-api';
  import { LanguageListItem, TranslatePayload, TreeItem } from '../types';
import { useNamespace } from '@/store/utils';
import { CustomSettings } from '@common/types';

  export default defineComponent({
    name: 'Translate',
    props: {
      languageList: {
        type: Array as () => LanguageListItem[],
        required: true,
      },
      selectedItem: Object as () => TreeItem,
      isTranslationEnabled: Boolean,
    },
    setup(props, { emit }) {
      // const source = ref('');
      
      const settingsModule = useNamespace('settings');
      const settings = settingsModule.useState<CustomSettings>('settings', { immediate: true });
      const saveSettings = settingsModule.useAction('saveSettings');
      const mode = ref<'all' | 'this' | ''>('');
      const overwrite = ref(false);

      async function handleChange() {
        await saveSettings(settings.value);
      }

      function selectAll() {
        settings.value.translationTo = props.languageList.filter(it => !it.disabled).map(it => it.language);
      }

      watch(mode, (current, previous) => {
        if (current === 'all' && overwrite.value) {
          const result = confirm(xOptionSelectedWarningMessage('Overwrite'));
          if (!result) {
            mode.value = previous;
          }
        }
      });

      watch(overwrite, (current, previous) => {
        if (current && mode.value === 'all') {
          const result = confirm(xOptionSelectedWarningMessage('All Keys'));
          if (!result) {
            overwrite.value = previous;
          }
        }
      });

      function translate() {
        emit('translate', {
          mode: mode.value,
          overwrite: overwrite.value,
          sourceLanguage: settings.value.translationFrom,
          targetLanguages: settings.value.translationTo,
        } as TranslatePayload);
      }

      return {
        settings,
        handleChange,
        mode,
        overwrite,
        selectAll,
        translate,
      };
    },
  });

  function xOptionSelectedWarningMessage(option: string) {
    return `The "${option}" option is selected, this will overwrite ALL your keys, are you sure?`;
  }
</script>

<style lang="scss">
  .targets {
    .v-select__selections {
      max-height: 72px;
      overflow: auto;
      margin-top: 8px;
      margin-bottom: 2px;
    }
  }

  .all-keys {
    label {
      color: var(--v-error-base) !important;
    }
  }
</style>
