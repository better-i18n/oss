/// Interpolate placeholder values into a translation string.
///
/// Supports both `{{name}}` (i18next compat) and `{name}` patterns.
/// Double-brace is processed first to avoid conflict.
///
/// ```dart
/// interpolate('Hello {{name}}!', {'name': 'Osman'})  // 'Hello Osman!'
/// interpolate('Hello {name}!', {'name': 'Osman'})    // 'Hello Osman!'
/// ```
String interpolate(String template, Map<String, dynamic>? args) {
  if (args == null || args.isEmpty) return template;

  var result = template;

  // 1. Replace {{key}} first (i18next compat)
  for (final entry in args.entries) {
    result = result.replaceAll('{{${entry.key}}}', '${entry.value}');
  }

  // 2. Replace {key}
  for (final entry in args.entries) {
    result = result.replaceAll('{${entry.key}}', '${entry.value}');
  }

  return result;
}
