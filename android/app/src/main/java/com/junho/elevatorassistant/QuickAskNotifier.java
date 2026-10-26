package com.junho.elevatorassistant;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.widget.RemoteViews;

import androidx.core.app.NotificationCompat;
import androidx.core.app.RemoteInput;
import androidx.core.content.ContextCompat;

/**
 * 알림창에 상시 표시되는 "AI 질문" 알림.
 * - 알림 본문(마이크 버튼): 눌러서 음성으로 질문 (VoiceAskActivity)
 * - "텍스트로 질문" 버튼: 알림창에서 바로 글자 입력 (RemoteInput → MainActivity)
 */
final class QuickAskNotifier {
    static final String CHANNEL_ID = "quick_ask";
    static final int NOTIFICATION_ID = 7101;
    static final String KEY_TEXT = "quick_ask_text";
    static final String EXTRA_ASK_TEXT = "ask_text";
    static final String ACTION_ASK_TEXT = "com.junho.elevatorassistant.QUICK_ASK_TEXT";

    private QuickAskNotifier() {}

    static void show(Context context) {
        try {
            Context app = context.getApplicationContext();
            if (Build.VERSION.SDK_INT >= 33
                    && ContextCompat.checkSelfPermission(app, Manifest.permission.POST_NOTIFICATIONS)
                    != PackageManager.PERMISSION_GRANTED) {
                return;
            }
            NotificationManager nm = (NotificationManager) app.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm == null) return;

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationChannel channel = new NotificationChannel(
                        CHANNEL_ID,
                        app.getString(R.string.quick_ask_channel),
                        NotificationManager.IMPORTANCE_LOW);
                channel.setDescription(app.getString(R.string.quick_ask_channel_desc));
                channel.setShowBadge(false);
                nm.createNotificationChannel(channel);
            }

            // 마이크(음성) → 음성 입력 화면
            Intent voice = new Intent(app, VoiceAskActivity.class);
            voice.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            PendingIntent micPi = PendingIntent.getActivity(
                    app, 1, voice, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

            RemoteViews views = new RemoteViews(app.getPackageName(), R.layout.notification_quick_ask);
            views.setOnClickPendingIntent(R.id.quick_ask_root, micPi);

            // 텍스트 입력 → RemoteInput 결과가 MainActivity 인텐트에 담겨 전달된다 (명시적 인텐트 + 변경 가능 PendingIntent)
            Intent text = new Intent(app, MainActivity.class);
            text.setAction(ACTION_ASK_TEXT);
            text.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            int mutable = Build.VERSION.SDK_INT >= Build.VERSION_CODES.S ? PendingIntent.FLAG_MUTABLE : 0;
            PendingIntent textPi = PendingIntent.getActivity(
                    app, 2, text, PendingIntent.FLAG_UPDATE_CURRENT | mutable);

            RemoteInput remoteInput = new RemoteInput.Builder(KEY_TEXT)
                    .setLabel(app.getString(R.string.quick_ask_input_label))
                    .build();
            NotificationCompat.Action action = new NotificationCompat.Action.Builder(
                    R.drawable.ic_mic, app.getString(R.string.quick_ask_text_action), textPi)
                    .addRemoteInput(remoteInput)
                    .build();

            NotificationCompat.Builder builder = new NotificationCompat.Builder(app, CHANNEL_ID)
                    .setSmallIcon(R.drawable.ic_mic)
                    .setStyle(new NotificationCompat.DecoratedCustomViewStyle())
                    .setCustomContentView(views)
                    .addAction(action)
                    .setContentIntent(micPi)
                    .setOngoing(true)
                    .setOnlyAlertOnce(true)
                    .setShowWhen(false)
                    .setPriority(NotificationCompat.PRIORITY_LOW)
                    .setVisibility(NotificationCompat.VISIBILITY_SECRET);

            nm.notify(NOTIFICATION_ID, builder.build());
        } catch (Exception ignored) {
            // 알림 표시 실패가 앱 동작에 영향을 주지 않도록 무시
        }
    }
}
