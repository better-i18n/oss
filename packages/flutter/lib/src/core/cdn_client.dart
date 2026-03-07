import 'dart:convert';

import 'package:http/http.dart' as http;

import 'config.dart';
import 'types.dart';

/// CDN client for fetching manifest and messages.
///
/// Uses injectable [http.Client] for testability.
class CdnClient {
  final NormalizedConfig config;
  final http.Client httpClient;

  CdnClient({required this.config, http.Client? httpClient})
      : httpClient = httpClient ?? http.Client();

  /// Fetch with timeout + exponential backoff retry.
  Future<http.Response> fetchWithRetry(String url) async {
    Object? lastError;

    for (var attempt = 0; attempt <= config.retryCount; attempt++) {
      try {
        final response = await httpClient
            .get(
              Uri.parse(url),
              headers: {'Cache-Control': 'no-cache'},
            )
            .timeout(Duration(milliseconds: config.fetchTimeout));
        return response;
      } catch (err) {
        lastError = err;
        if (attempt < config.retryCount) {
          // Simple exponential backoff: 200ms, 400ms, ...
          await Future<void>.delayed(
            Duration(milliseconds: 200 * (attempt + 1)),
          );
        }
      }
    }

    throw lastError!;
  }

  /// Fetch manifest from CDN.
  Future<ManifestResponse> fetchManifest() async {
    final url = '${config.projectBaseUrl}/manifest.json';
    final response = await fetchWithRetry(url);

    if (response.statusCode != 200) {
      throw Exception(
        '[better-i18n] Manifest fetch failed (${response.statusCode})',
      );
    }

    final data = jsonDecode(response.body) as Map<String, dynamic>;
    return ManifestResponse.fromJson(data);
  }

  /// Fetch messages for a locale from CDN.
  Future<Messages> fetchMessages(String locale) async {
    final url = '${config.projectBaseUrl}/$locale/translations.json';
    final response = await fetchWithRetry(url);

    if (response.statusCode != 200) {
      throw Exception(
        '[better-i18n] Messages fetch failed for locale "$locale" '
        '(${response.statusCode})',
      );
    }

    final data = jsonDecode(response.body) as Map<String, dynamic>;
    return _parseMessages(data);
  }

  /// Parse raw JSON into [Messages] (namespace → key → value).
  static Messages _parseMessages(Map<String, dynamic> raw) {
    final messages = <String, Map<String, dynamic>>{};
    for (final entry in raw.entries) {
      if (entry.value is Map<String, dynamic>) {
        messages[entry.key] = entry.value as Map<String, dynamic>;
      }
    }
    return messages;
  }
}
