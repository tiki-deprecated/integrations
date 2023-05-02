package com.mytiki.examples.admob

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import android.widget.Button
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.OnUserEarnedRewardListener
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback

class MainActivity : AppCompatActivity() {

    private var rewardedAd: RewardedAd? = null
    private val TAG = "MainActivity"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        loadAd()
        findViewById<Button>(R.id.button).setOnClickListener {
            rewardedAd?.let { ad ->
                ad.show(this, OnUserEarnedRewardListener { rewardItem ->
                    Log.d(TAG, "User earned the reward.")
                })
            } ?: run {
                Log.d(TAG, "The rewarded ad wasn't ready yet.")
            }
        }
    }

    private fun loadAd() {
        val adRequest = AdRequest.Builder().build()
        TikiSdk.guard()
        RewardedAd.load(this,"ca-app-pub-3940256099942544/5224354917",
            adRequest, object : RewardedAdLoadCallback() {
                override fun onAdFailedToLoad(adError: LoadAdError) {
                    Log.d(TAG, adError.toString())
                    rewardedAd = null
                }

                override fun onAdLoaded(ad: RewardedAd) {
                    Log.d(TAG, "Ad was loaded.")
                    rewardedAd = ad
                }
            })
    }
}