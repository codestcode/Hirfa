#!/bin/bash
set -e

echo "=== Installing Java JDK 21 and build tools ==="
apt-get update
apt-get install -y openjdk-21-jdk unzip wget git

echo "=== Setting up Android SDK ==="
mkdir -p /opt/android-sdk/cmdline-tools
cd /opt/android-sdk/cmdline-tools
wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip -q commandlinetools-linux-11076708_latest.zip
mv cmdline-tools latest

export ANDROID_HOME=/opt/android-sdk
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH

echo "=== Accepting licenses ==="
mkdir -p /opt/android-sdk/licenses
yes | sdkmanager --licenses || true

echo "=== Building APK ==="
cd /project/android
./gradlew assembleDebug

echo "=== Copying compiled APK ==="
cp app/build/outputs/apk/debug/app-debug.apk /project/app-debug.apk
echo "=== Build Succeeded! APK copied to project root as app-debug.apk ==="
