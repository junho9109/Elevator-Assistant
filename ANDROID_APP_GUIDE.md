# Android WebView 앱 - 음성인식 기능 추가 가이드

이 가이드를 따라 Android 앱을 만들면 무료로 음성인식 기능을 사용할 수 있습니다.

## 필요한 도구
- Android Studio (무료 다운로드: https://developer.android.com/studio)

## 1단계: 새 프로젝트 생성

1. Android Studio 열기
2. "New Project" 선택
3. "Empty Activity" 선택
4. 프로젝트 이름: `ElevatorStandardsApp`
5. Package name: `com.elevator.standards`
6. Language: **Kotlin**
7. Minimum SDK: API 24 (Android 7.0)

## 2단계: AndroidManifest.xml 수정

`app/src/main/AndroidManifest.xml` 파일을 열고 다음과 같이 수정:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.elevator.standards">

    <!-- 권한 추가 -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="기술자료조회"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ElevatorStandardsApp"
        android:usesCleartextTraffic="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

## 3단계: MainActivity.kt 수정

`app/src/main/java/com/elevator/standards/MainActivity.kt` 파일을 다음 코드로 교체:

```kotlin
package com.elevator.standards

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.PermissionRequest
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {
    
    private lateinit var webView: WebView
    private var speechRecognizer: SpeechRecognizer? = null
    
    companion object {
        private const val PERMISSION_REQUEST_CODE = 1001
        // 여기에 배포된 웹앱 URL을 입력하세요
        private const val WEB_URL = "https://YOUR_REPLIT_URL.replit.app"
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        webView = WebView(this)
        setContentView(webView)
        
        setupWebView()
        checkPermissions()
    }
    
    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            mediaPlaybackRequiresUserGesture = false
            cacheMode = WebSettings.LOAD_DEFAULT
        }
        
        webView.webViewClient = WebViewClient()
        webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) {
                runOnUiThread {
                    request.grant(request.resources)
                }
            }
        }
        
        // JavaScript 브릿지 추가
        webView.addJavascriptInterface(SpeechBridge(), "AndroidSpeech")
        
        webView.loadUrl(WEB_URL)
    }
    
    private fun checkPermissions() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) 
            != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.RECORD_AUDIO),
                PERMISSION_REQUEST_CODE
            )
        }
    }
    
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Toast.makeText(this, "마이크 권한이 허용되었습니다", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "음성인식을 위해 마이크 권한이 필요합니다", Toast.LENGTH_LONG).show()
            }
        }
    }
    
    inner class SpeechBridge {
        
        @JavascriptInterface
        fun startListening() {
            runOnUiThread {
                startSpeechRecognition()
            }
        }
        
        @JavascriptInterface
        fun stopListening() {
            runOnUiThread {
                speechRecognizer?.stopListening()
            }
        }
    }
    
    private fun startSpeechRecognition() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) 
            != PackageManager.PERMISSION_GRANTED) {
            sendToWeb("onSpeechError", "마이크 권한이 필요합니다")
            checkPermissions()
            return
        }
        
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            sendToWeb("onSpeechError", "음성인식을 사용할 수 없습니다")
            return
        }
        
        speechRecognizer?.destroy()
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this)
        
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, "ko-KR")
            putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
        }
        
        speechRecognizer?.setRecognitionListener(object : RecognitionListener {
            override fun onReadyForSpeech(params: Bundle?) {}
            override fun onBeginningOfSpeech() {}
            override fun onRmsChanged(rmsdB: Float) {}
            override fun onBufferReceived(buffer: ByteArray?) {}
            override fun onEndOfSpeech() {
                sendToWeb("onSpeechEnd", "")
            }
            
            override fun onError(error: Int) {
                val errorMessage = when (error) {
                    SpeechRecognizer.ERROR_AUDIO -> "오디오 오류"
                    SpeechRecognizer.ERROR_CLIENT -> "클라이언트 오류"
                    SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "권한이 필요합니다"
                    SpeechRecognizer.ERROR_NETWORK -> "네트워크 오류"
                    SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> "네트워크 시간 초과"
                    SpeechRecognizer.ERROR_NO_MATCH -> "음성을 인식하지 못했습니다"
                    SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "인식기가 사용 중입니다"
                    SpeechRecognizer.ERROR_SERVER -> "서버 오류"
                    SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "음성 입력 시간 초과"
                    else -> "알 수 없는 오류"
                }
                sendToWeb("onSpeechError", errorMessage)
            }
            
            override fun onResults(results: Bundle?) {
                val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                if (!matches.isNullOrEmpty()) {
                    sendToWeb("onSpeechResult", matches[0])
                }
            }
            
            override fun onPartialResults(partialResults: Bundle?) {
                val matches = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                if (!matches.isNullOrEmpty()) {
                    sendToWeb("onSpeechPartial", matches[0])
                }
            }
            
            override fun onEvent(eventType: Int, params: Bundle?) {}
        })
        
        speechRecognizer?.startListening(intent)
    }
    
    private fun sendToWeb(functionName: String, data: String) {
        val escapedData = data.replace("'", "\\'").replace("\"", "\\\"")
        webView.post {
            webView.evaluateJavascript("if(typeof $functionName === 'function') $functionName('$escapedData')", null)
        }
    }
    
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
    
    override fun onDestroy() {
        speechRecognizer?.destroy()
        webView.destroy()
        super.onDestroy()
    }
}
```

## 4단계: 레이아웃 파일 삭제 (선택사항)

`app/src/main/res/layout/activity_main.xml` 파일은 필요 없으므로 삭제해도 됩니다.

## 5단계: URL 수정

`MainActivity.kt` 파일에서 다음 줄을 찾아 실제 배포된 URL로 변경:

```kotlin
private const val WEB_URL = "https://YOUR_REPLIT_URL.replit.app"
```

예시:
```kotlin
private const val WEB_URL = "https://elevator-standards.replit.app"
```

## 6단계: 앱 빌드

1. Android Studio에서 `Build` > `Build Bundle(s) / APK(s)` > `Build APK(s)` 선택
2. 빌드가 완료되면 `app/build/outputs/apk/debug/app-debug.apk` 파일 생성됨
3. 이 APK 파일을 안드로이드 기기에 설치

## 7단계: 테스트

1. 앱 실행
2. 마이크 버튼 클릭
3. 한국어로 말하기
4. 인식된 텍스트로 검색

## 문제 해결

### 음성인식이 안 될 때
- 설정 > 앱 > 기술자료조회 > 권한 > 마이크 허용
- 인터넷 연결 확인 (Google 음성인식 서비스 필요)

### 앱이 안 열릴 때
- 설정 > 보안 > 알 수 없는 출처 허용

## 참고

- Google 음성인식은 Android에 기본 내장되어 있어 **무료**입니다
- 인터넷 연결이 필요합니다 (Google 서버와 통신)
- 한국어(ko-KR)가 기본 설정되어 있습니다
