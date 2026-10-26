package com.junho.elevatorassistant;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * 알림창·빠른 설정 타일에서 입력한 질문을 웹(AI 검색)으로 넘기는 다리.
 * - 앱이 꺼져 있다가 켜지는 경우: 웹이 열린 뒤 getPending()으로 질문을 가져간다.
 * - 앱이 이미 떠 있는 경우: "ask" 이벤트로 알려 주고, 웹이 getPending()으로 가져간다.
 */
@CapacitorPlugin(name = "NativeAsk")
public class NativeAskPlugin extends Plugin {
    private static String pendingText = null;
    private static NativeAskPlugin instance = null;

    @Override
    public void load() {
        instance = this;
    }

    @Override
    protected void handleOnDestroy() {
        if (instance == this) {
            instance = null;
        }
    }

    /** 네이티브 쪽에서 질문을 보관하고, 웹이 떠 있으면 알려 준다. */
    static synchronized void deliver(String text) {
        if (text == null) return;
        String t = text.trim();
        if (t.isEmpty()) return;
        pendingText = t;
        NativeAskPlugin p = instance;
        if (p != null) {
            p.notifyListeners("ask", new JSObject());
        }
    }

    @PluginMethod
    public void getPending(PluginCall call) {
        String t;
        synchronized (NativeAskPlugin.class) {
            t = pendingText;
            pendingText = null;
        }
        JSObject ret = new JSObject();
        ret.put("text", t == null ? "" : t);
        call.resolve(ret);
    }
}
