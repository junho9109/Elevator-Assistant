package com.junho.elevatorassistant;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.os.Bundle;
import android.speech.RecognizerIntent;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import java.util.ArrayList;

/**
 * 투명 화면. 시스템 음성 인식 창을 띄우고, 인식된 문장을 MainActivity(AI 검색)로 넘긴다.
 * 시스템 음성 인식 창을 쓰므로 별도의 마이크 권한 요청이 필요 없다.
 */
public class VoiceAskActivity extends AppCompatActivity {
    private ActivityResultLauncher<Intent> launcher;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        launcher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    String text = null;
                    if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                        ArrayList<String> matches =
                                result.getData().getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
                        if (matches != null && !matches.isEmpty()) {
                            text = matches.get(0);
                        }
                    }
                    if (text != null && !text.trim().isEmpty()) {
                        Intent open = new Intent(this, MainActivity.class);
                        open.putExtra(QuickAskNotifier.EXTRA_ASK_TEXT, text.trim());
                        open.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
                        startActivity(open);
                    }
                    finish();
                });

        // 화면 회전 등으로 다시 만들어진 경우에는 음성 창을 또 띄우지 않는다.
        if (savedInstanceState == null) {
            startRecognizer();
        }
    }

    private void startRecognizer() {
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "ko-KR");
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT, getString(R.string.quick_ask_voice_prompt));
        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
        try {
            launcher.launch(intent);
        } catch (ActivityNotFoundException e) {
            Toast.makeText(this, R.string.quick_ask_voice_unavailable, Toast.LENGTH_LONG).show();
            finish();
        }
    }
}
