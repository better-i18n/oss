/// Flutter SDK for better-i18n — runtime translation loading from CDN.
library;

// Core (pure Dart)
export 'src/core/types.dart'
    show
        Messages,
        ManifestLanguage,
        ManifestResponse,
        LanguageOption,
        I18nConfig,
        ParsedProject,
        TranslationStorage;
export 'src/core/config.dart' show NormalizedConfig, parseProject, normalizeConfig;
export 'src/core/i18n_core.dart' show I18nCore;
export 'src/core/interpolation.dart' show interpolate;
export 'src/core/locale_utils.dart' show normalizeLocale, detectLocale;

// Storage
export 'src/storage/shared_prefs_storage.dart' show SharedPrefsStorage;

// Flutter widgets
export 'src/flutter/better_i18n_controller.dart' show BetterI18nController;
export 'src/flutter/better_i18n_scope.dart' show BetterI18nScope;
export 'src/flutter/better_i18n_provider.dart' show BetterI18nProvider;
export 'src/flutter/extensions.dart' show BetterI18nExtensions;
