// Hand-authored visual re-render recipes for the props playground.
// Each recipe is a pure function (values) => innerHTML string, built from the
// real class ternaries found in the component's source (not guessed).
// Only components listed here get a live-updating visual preview; the rest
// fall back to a live-updating code sample only (see playground.js).
window.PLAYGROUND_RECIPES = {
  'components/dsfr/Button.vue': function (v) {
    var sizeCls = { xs: 'px-2 py-1 text-xs min-h-[32px]', sm: 'px-3 py-1 text-sm min-h-[34px]', md: 'px-4 py-2 text-base min-h-[42px]', lg: 'px-6 py-2 text-lg min-h-[3rem]' }[v.size || 'md']
    var typeCls = {
      primary: 'text-white bg-jva-blue-500 hover:bg-jva-blue-800 active:bg-jva-blue-900',
      secondary: 'text-jva-blue-500 shadow-[inset_0_0_0_1px_#000091] bg-white hover:bg-[#F6F6F6] active:bg-[#EDEDED]',
      tertiary: 'text-jva-blue-500 shadow-[inset_0_0_0_1px_#ddd] bg-white hover:bg-[#F6F6F6] active:bg-[#EDEDED]',
      'tertiary-no-outline': 'text-jva-blue-500 bg-white hover:bg-[#F6F6F6] active:bg-[#EDEDED]',
      transparent: 'bg-transparent border',
    }[v.type || 'primary']
    var disabledCls = v.disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
    var spinner = v.loading
      ? '<svg class="animate-spin w-4 h-4 fill-current" viewBox="0 0 24 24" style="margin-right:6px"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="3" fill="none" stroke-opacity="0.3"/><path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" fill="none"/></svg>'
      : ''
    return '<button type="button" class="font-medium transition-extended ease-out inline-flex items-center justify-center cursor-pointer ' + typeCls + ' ' + sizeCls + ' ' + disabledCls + '">' + spinner + 'Connexion</button>'
  },

  'components/base/Button.vue': function (v) {
    var sizeCls = { xxs: 'px-2 py-1 text-xs', xs: 'px-2.5 py-1.5 text-xs', sm: 'px-3 py-2 text-sm leading-4', md: 'px-4 py-2 text-sm', lg: 'px-4 py-2 text-base', xl: 'px-6 py-3 text-lg' }[v.size || 'md']
    var variantCls = {
      primary: 'text-white bg-jva-blue-500 hover:bg-jva-blue-700 border-transparent focus:ring-jva-blue-500',
      green: 'text-white bg-jva-green-500 hover:bg-jva-green-600 border-transparent focus:ring-jva-green-500',
      secondary: 'jva-blue bg-cool-gray-100 hover:bg-cool-gray-50 border-gray-200 focus:ring-jva-blue-500',
      white: 'text-cool-gray-700 bg-white hover:bg-cool-gray-50 border border-cool-gray-300 focus:ring-cool-gray-500',
      red: 'text-white bg-jva-red-500 hover:bg-jva-red-600 border-transparent focus:ring-jva-red-500',
    }[v.variant || 'primary'] || 'text-white bg-jva-blue-500 hover:bg-jva-blue-700 border-transparent'
    var disabledCls = v.loading ? 'opacity-25 cursor-not-allowed' : ''
    return '<button type="button" class="inline-flex items-center border font-bold shadow-sm transition ' + variantCls + ' ' + sizeCls + ' ' + disabledCls + '">Primary</button>'
  },

  'components/dsfr/IconButton.vue': function (v) {
    var sizeCls = { xs: 'px-2 py-1 min-h-[32px]', sm: 'px-2.5 py-1 min-h-[34px]', md: 'px-4 py-2 min-h-[42px]', lg: 'px-6 py-2 min-h-[48px]' }[v.size || 'md']
    var variantCls = {
      primary: 'text-white bg-jva-blue-500 hover:bg-jva-blue-800 active:bg-jva-blue-900',
      secondary: 'text-jva-blue-500 shadow-[inset_0_0_0_1px_#000091] bg-white hover:bg-[#F6F6F6] active:bg-[#EDEDED]',
      tertiary: 'text-jva-blue-500 shadow-[inset_0_0_0_1px_#ddd] bg-white hover:bg-[#F6F6F6] active:bg-[#EDEDED]',
      'tertiary-no-outline': 'text-jva-blue-500 bg-white hover:bg-[#F6F6F6] active:bg-[#EDEDED]',
      transparent: 'bg-transparent border',
    }[v.variant || 'primary']
    var disabledCls = v.disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''
    return '<button type="button" class="font-medium transition-extended ease-out inline-flex items-center justify-center ' + variantCls + ' ' + sizeCls + ' ' + disabledCls + '"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4v16m-8-8h16" stroke="currentColor" stroke-width="2" fill="none"/></svg></button>'
  },

  'components/dsfr/Badge.vue': function (v) {
    var sizeCls = { xs: 'px-[6px] text-[11px]', sm: 'px-[6px] text-xs', md: 'px-2 text-sm' }[v.size || 'md']
    var typeCls = {
      success: 'text-[#18753C] bg-[#B8FEC9]', error: 'text-[#CE0500] bg-[#FFE9E9]', info: 'text-[#0063CB] bg-[#E8EDFF]',
      warning: 'text-[#B34000] bg-[#FFE9E6]', new: 'text-[#695240] bg-[#FEEBD0]', default: 'text-[#6E445A] bg-[#FEE7FC]',
      gray: 'text-[#3A3A3A] bg-[#EEEEEE]', yellow: 'text-[#716043] bg-[#FEECC2]', blue: 'text-[#0063CB] bg-[#E8EDFF]',
      recommendation: 'text-[#0063CB] bg-[#F5F5FE]',
    }[v.type || 'default']
    return '<span class="inline-flex items-center justify-center max-w-full truncate uppercase rounded font-bold ' + typeCls + ' ' + sizeCls + '">' + (v.type || 'default') + '</span>'
  },

  'components/dsfr/Tag.vue': function (v) {
    var sizeCls = { sm: 'px-2 py-0.5 text-xs h-6', md: 'px-3 py-1 text-sm h-8' }[v.size || 'sm']
    var ctxCls = {
      default: 'text-[#161616] bg-[#EEEEEE]',
      clickable: 'text-jva-blue-500 bg-[#E3E3FD] hover:bg-[#C1C1FB] cursor-pointer active:bg-[#ADADF9]',
      selectable: v.isActive ? 'bg-jva-blue-500 text-white hover:bg-[#1212FF]' : 'text-jva-blue-500 bg-[#E3E3FD] hover:bg-[#C1C1FB] cursor-pointer',
      radio: v.isActive ? 'bg-jva-blue-500 text-white' : 'text-jva-blue-500 bg-[#E3E3FD] cursor-pointer',
      dropdownToggle: v.isActive ? 'bg-jva-blue-500 text-white hover:bg-[#1212FF]' : 'text-jva-blue-500 bg-[#E3E3FD] hover:bg-[#C1C1FB] cursor-pointer',
      deletable: 'bg-jva-blue-500 text-white cursor-pointer hover:bg-[#1212FF]',
    }[v.context || 'default']
    var disabledCls = v.disabled ? '!bg-[#EEEEEE] !cursor-not-allowed opacity-60' : ''
    return '<button type="button" class="tag inline-flex items-center justify-center rounded-full relative transition select-none ' + ctxCls + ' ' + sizeCls + ' ' + disabledCls + '">Nature</button>'
  },

  'components/dsfr/TagLink.vue': function (v) {
    var sizeCls = { sm: 'px-2 py-0.5 text-xs h-6', md: 'px-3 py-1 text-sm h-8' }[v.size || 'sm']
    var disabledCls = v.disabled ? '!bg-[#EEEEEE] !cursor-not-allowed opacity-60' : ''
    return '<a class="tag inline-flex items-center justify-center rounded-full relative transition select-none text-jva-blue-500 bg-[#E3E3FD] hover:bg-[#C1C1FB] cursor-pointer active:bg-[#ADADF9] ' + sizeCls + ' ' + disabledCls + '">Voir le domaine</a>'
  },

  'components/base/Avatar.vue': function (v) {
    var sizeCls = { xs: 'w-10 h-10', sm: 'w-12 h-12', md: 'w-16 h-16', lg: 'w-24 h-24' }[v.size || 'sm']
    var bgCls = v.backgroundColor === 'white' ? 'bg-white' : 'bg-jva-blue-500'
    var textCls = v.backgroundColor === 'white' ? 'text-gray-700' : 'text-white'
    return '<span class="component--avatar overflow-hidden rounded-full flex-none flex items-center justify-center ' + sizeCls + ' ' + bgCls + '"><span class="first-letter:uppercase text-xl ' + textCls + '">JD</span></span>'
  },

  'components/base/Toggle.vue': function (v) {
    var sizeCls = { md: 'h-6 w-10', lg: 'h-6 w-10', xl: 'h-8 w-12' }[v.size || 'lg']
    var knobSizeCls = { md: 'h-6 w-6', lg: 'h-6 w-6', xl: 'h-8 w-8' }[v.size || 'lg']
    var on = !!v.modelValue
    var btnCls = on ? 'bg-jva-blue-500 border-jva-blue-500' : 'bg-white border-jva-blue-500'
    var translate = on ? 'translate-x-4' : 'translate-x-0'
    var reverse = v.position === 'right' ? 'flex-row-reverse' : ''
    return '<div class="flex items-start gap-4"><div class="flex items-start gap-4 ' + reverse + '"><button type="button" class="relative inline-flex flex-shrink-0 border rounded-full transition-colors ease-in-out duration-200 ' + btnCls + ' ' + sizeCls + '"><span class="relative top-[-1px] left-[-1px] inline-flex items-center justify-center bg-white border border-jva-blue-500 rounded-full transform transition ease-in-out duration-200 ' + translate + ' ' + knobSizeCls + '"></span></button><label class="block text-base text-gray-700">' + (v.label || 'Rendre mon profil visible') + '</label></div></div>'
  },

  'components/base/Gauge.vue': function (v) {
    var sizeCls = { xs: 'h-1', sm: 'h-2', lg: 'h-3', xl: 'h-4' }[v.size || 'sm']
    return '<div class="w-full max-w-xs flex flex-col gap-1"><div class="relative w-full"><span class="w-full bg-[#EEEEEE] border rounded-full border-[#DDDDDD] overflow-hidden block ' + sizeCls + '"><span class="bg-jva-blue-500 transition-all duration-500 block ' + sizeCls + '" style="width:65%"></span></span></div></div>'
  },

  'components/base/Alert.vue': function (v) {
    var bgCls = v.variant === 'warning' ? 'bg-[#FFE9E6]' : 'bg-jva-blue-50'
    var textCls = v.variant === 'warning' ? 'text-[#B34000]' : 'text-jva-blue-500'
    return '<div class="p-4 ' + bgCls + '"><div class="flex"><div class="flex-shrink-0"><svg class="h-5 w-5 fill-current mt-[2px] ' + textCls + '" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg></div><div class="ml-3 flex-1"><p class="text-sm ' + textCls + '">Information affichée dans l\'alerte.</p></div></div></div>'
  },

  'components/dsfr/Alert.vue': function (v) {
    var bg = v.variant === 'success' ? 'bg-[#E3FDEB] border-[#6FE49D]' : 'bg-[#F5F7FF] border-[#CACAFB]'
    var iconColor = v.variant === 'success' ? '#18753C' : '#0063CB'
    return '<div class="p-6 flex items-start gap-4 border rounded ' + bg + '"><svg class="w-8 h-8" viewBox="0 0 24 24" fill="' + iconColor + '"><circle cx="12" cy="12" r="10"/></svg><div class="text-[#161616] flex-1">Message d\'information mis en avant.</div></div>'
  },

  'components/custom/Tips.vue': function (v) {
    var cls = v.variant === 'warning' ? 'border-yellow-200 bg-yellow-50' : 'border-[#B9CEFF] bg-[#F5F7FF]'
    var icon = v.variant === 'warning' ? '⚠️' : '💡'
    return '<aside role="note" class="border p-4 lg:p-6 rounded max-w-[420px] ' + cls + '"><div class="flex flex-col lg:flex-row lg:items-start gap-4"><span>' + icon + '</span><p class="text-sm">Astuce : complétez votre profil pour recevoir des recommandations personnalisées.</p></div></aside>'
  },

  'components/base/Heading.vue': function (v) {
    var cls = { '1': 'text-2xl sm:text-4xl font-extrabold', '2': 'text-3xl font-bold', '3': 'text-[20px] sm:text-[22px] font-extrabold', '4': 'text-lg font-bold', '5': 'text-base font-bold' }[String(v.level || '2')]
    return '<p class="' + cls + '">Titre de section (niveau ' + (v.level || '2') + ')</p>'
  },

  'components/dsfr/Separator.vue': function (v) {
    var label = v.label || 'ou'
    return '<div class="flex items-center w-full gap-4" role="separator"><div class="flex-1 border-t border-[#DDDDDD]"></div><span class="shrink-0 font-bold text-[#666666]">' + label + '</span><div class="flex-1 border-t border-[#DDDDDD]"></div></div>'
  },

  'components/ui/BadgeState.vue': function (v) {
    var map = {
      'Validée': 'success', 'validated': 'success',
      'Refusée': 'error', 'Annulée': 'error', 'refused': 'error',
      'En attente de validation': 'warning', 'En cours de traitement': 'warning', 'waiting': 'warning',
      'Brouillon': 'info', 'draft': 'info',
    }
    var type = map[v.state] || 'default'
    var typeCls = {
      success: 'text-[#18753C] bg-[#B8FEC9]', error: 'text-[#CE0500] bg-[#FFE9E9]', warning: 'text-[#716043] bg-[#FEECC2]',
      info: 'text-[#0063CB] bg-[#E8EDFF]', default: 'text-[#3A3A3A] bg-[#EEEEEE]',
    }[type]
    return '<span class="inline-flex items-center justify-center max-w-full truncate uppercase rounded font-bold px-2 text-sm ' + typeCls + '">' + (v.state || 'Validée') + '</span>'
  },

  'components/BadgeOnline.vue': function (v) {
    var dot = v.isOnline ? 'bg-green-600' : 'bg-red-600'
    var label = v.isOnline ? v.activeLabel || 'En ligne' : v.inactiveLabel || 'Hors ligne'
    return '<span class="inline-flex items-center rounded-full px-3 py-1 text-xs bg-[#EEEEEE] text-[#161616]"><span class="flex items-center"><span class="h-2 w-2 rounded-full mr-1 ' + dot + '"></span>' + label + '</span></span>'
  },

  'components/dsfr/CheckboxBoolean.vue': function (v) {
    var disabledCls = v.disabled ? 'opacity-50 cursor-not-allowed' : ''
    return '<label class="text-left cursor-pointer ' + disabledCls + '"><span class="inline-flex items-start gap-3"><input type="checkbox" ' + (v.modelValue ? 'checked' : '') + ' ' + (v.disabled ? 'disabled' : '') + ' class="relative text-jva-blue-500 border-jva-blue-500 rounded-[4px] initial:size-6"><span>J\'accepte les conditions</span></span></label>'
  },
}
