package com.junho.elevatorassistant;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;

import androidx.core.app.RemoteInput;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private static final String EXTRA_ASK_HANDLED = "ask_handled";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // 알림창·빠른 설정에서 입력한 질문을 웹으로 넘기는 플러그인 (super.onCreate 전에 등록해야 한다)
        registerPlugin(NativeAskPlugin.class);
        super.onCreate(savedInstanceState);
        createNotificationChannel();
        QuickAskNotifier.show(this);
        // 처음 켜질 때 들어온 인텐트는 BridgeActivity.onCreate가 onNewIntent(getIntent())로 한 번 넘겨 주므로
        // 여기서 따로 처리하지 않는다.
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleAskIntent(intent);
    }

    @Override
    public void onResume() {
        super.onResume();
        // 알림 권한을 나중에 허용한 경우에도, 입력 후 알림이 초기 상태로 돌아오도록 다시 표시한다.
        QuickAskNotifier.show(this);
    }

    /** 음성(extra) 또는 알림창 글자 입력(RemoteInput)으로 들어온 질문을 꺼내 웹으로 넘긴다. */
    private void handleAskIntent(Intent intent) {
        if (intent == null) return;
        // 같은 인텐트를 두 번 처리하지 않도록 표시(화면이 다시 만들어져도 인텐트 extra는 유지된다)
        if (intent.getBooleanExtra(EXTRA_ASK_HANDLED, false)) return;
        String text = intent.getStringExtra(QuickAskNotifier.EXTRA_ASK_TEXT);
        if (text == null) {
            Bundle results = RemoteInput.getResultsFromIntent(intent);
            if (results != null) {
                CharSequence cs = results.getCharSequence(QuickAskNotifier.KEY_TEXT);
                if (cs != null) text = cs.toString();
            }
        }
        if (text == null) return;
        intent.removeExtra(QuickAskNotifier.EXTRA_ASK_TEXT);
        intent.putExtra(EXTRA_ASK_HANDLED, true);
        NativeAskPlugin.deliver(text);
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                "chat",
                "채팅 알림",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("새 채팅 메시지 알림");
            channel.enableVibration(true);
            channel.setShowBadge(true);
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }
}
