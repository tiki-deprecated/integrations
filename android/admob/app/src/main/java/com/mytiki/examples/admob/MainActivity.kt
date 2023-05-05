package com.mytiki.examples.admob

import android.os.Bundle
import android.util.Log
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.res.ResourcesCompat
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.ump.*
import com.mytiki.tiki_sdk_android.LicenseUsecase
import com.mytiki.tiki_sdk_android.TikiSdk
import com.mytiki.tiki_sdk_android.TitleTag
import com.mytiki.tiki_sdk_android.ui.Permission
import java.util.concurrent.TimeUnit


class MainActivity : AppCompatActivity() {

    private var consentInformation: ConsentInformation? = null
    private val tag = "MainActivity"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        findViewById<Button>(R.id.see_ad).setOnClickListener {
            loadAd()
        }

        TikiSdk
            .offer
            .ptr("AdTrackingRewarded")
            .reward(ResourcesCompat.getDrawable(resources, R.drawable.offer_img, null)!!)
            .bullet("Learn how our ads perform ", true)
            .bullet("Reach you on other platforms", false)
            .bullet("Sold to other companies", false)
            .use(listOf(
                    LicenseUsecase.ATTRIBUTION), listOf("mycompany.com/api/tracking"))
            .tag(TitleTag.ADVERTISING_DATA)
            .description("Share your IDFA (kind of like a serial # for your phone) to get better ads.")
            .terms(this, "terms.md")
            .duration(365, TimeUnit.DAYS)
            .add()
        .onAccept{ _, _ ->
            initAdMob()
        }
        .init(this, "e12f5b7b-6b48-4503-8b39-28e4995b5f88","AdMobUser", onComplete = {
            TikiSdk.present(this)
        })

    }

    private fun initAdMob(){
        /* uncomment to debug UMP
        val debugSettings = ConsentDebugSettings.Builder(this)
            .setDebugGeography(ConsentDebugSettings.DebugGeography.DEBUG_GEOGRAPHY_EEA)
            .addTestDeviceHashedId("69F8934CC7A23E2776AC06317FAE7CFA")
            .build()
        */
        val params = ConsentRequestParameters
            .Builder()
            // .setConsentDebugSettings(debugSettings) // uncomment to debug UMP
            .build()

        consentInformation = UserMessagingPlatform.getConsentInformation(this)
        consentInformation!!.requestConsentInfoUpdate(this, params,
            {
                val consent = consentInformation!!.consentStatus
                if (consentInformation!!.isConsentFormAvailable) {
                    this.loadForm()
                }
            },
            {
                Log.e(tag, it.toString())
            })
    }

    private fun loadForm() {
        // Loads a consent form. Must be called on the main thread.
        UserMessagingPlatform.loadConsentForm(
            this,
            { it ->
                if (consentInformation!!.consentStatus == ConsentInformation.ConsentStatus.REQUIRED) {
                    it.show(this) { error ->
                        if(error != null) {
                            Log.e(tag, error.message)
                        }
                        if (
                            consentInformation!!.consentStatus != ConsentInformation.ConsentStatus.OBTAINED){
                            // handle no consent
                        }
                    }
                }
            },
            {
                Log.e(tag, it.toString())
            }
        )
    }

    private fun loadAd() {
        MobileAds.initialize(this)
        val adRequest = AdRequest.Builder().build()
        InterstitialAd.load(this, "ca-app-pub-3940256099942544/1033173712", adRequest,
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(interstitialAd: InterstitialAd) {
                    interstitialAd.show(this@MainActivity)
                }

                override fun onAdFailedToLoad(loadAdError: LoadAdError) {
                    Log.d(tag, loadAdError.toString())
                }
            })
    }

}