package com.junho.elevatorassistant;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/** 기기를 다시 켜거나 앱을 업데이트한 뒤에도 알림창의 "AI 질문" 알림을 다시 표시한다. */
public class QuickAskBootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;
        String action = intent.getAction();
        if (Intent.ACTION_BOOT_COMPLETED.equals(action) || Intent.ACTION_MY_PACKAGE_REPLACED.equals(action)) {
            QuickAskNotifier.show(context);
        }
    }
}
