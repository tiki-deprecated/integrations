/* global TikiSdk,TIKI_SETTINGS,ShopifyAnalytics,_st,Shopify */

const tikiId = 'tiki-offer'
const tikiOverlayId = 'tiki-offer-overlay'

const tikiSetDecisionCookie = () => {
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);
  document.cookie = `tiki_decision=true; expires=${expiry.toUTCString()}; path=/`;
}

const tikiGetCustomerId = () => {
  try {
    const curr = window.ShopifyAnalytics.meta.page.customerId
    if (curr !== undefined && curr !== null && curr !== '') {
      return curr
    }
  } catch (e) { }
  try {
    const curr = window.meta.page.customerId
    if (curr !== undefined && curr !== null && curr !== '') {
      return curr
    }
  } catch (e) { }
  try {
    const curr = _st.cid
    if (curr !== undefined && curr !== null && curr !== '') {
      return curr
    }
  } catch (e) { }
  try {
    const curr = ShopifyAnalytics.lib.user().traits().uniqToken
    if (curr !== undefined && curr !== null && curr !== '') {
      return curr
    }
  } catch (e) { }
  return null
}

const tikiAnon = () => {
  if (document.getElementById(tikiId) == null) {
    const div = document.createElement('div')
    div.id = tikiId
    div.appendChild(tikiAnonCreateOverlay())
    document.body.appendChild(div)
    tikiAnonGoTo('prompt')
  }
}

const tikiAnonGoTo = (step) => {
  switch (step) {
    case 'none': {
      const element = document.getElementById(tikiId)
      if (element != null) element.remove()
      break
    }
    case 'prompt': {
      const offerPrompt = TikiSdk.UI.Screen.Prompt.create(
        TikiSdk.config()._offers[0],
        () => {
          offerPrompt.remove()
          tikiAnonGoTo('terms')
        },
        () => {
          offerPrompt.remove()
        },
        () => {
          offerPrompt.remove()
          tikiAnonGoTo('learnMore')
        },
        TikiSdk.config().activeTheme
      )
      tikiAnonShowScreen(offerPrompt)
      break
    }
    case 'learnMore': {
      const learnMore = TikiSdk.UI.Screen.LearnMore.create(() => {
        learnMore.remove()
        tikiAnonGoTo('prompt')
      }, TikiSdk.config().activeTheme)
      tikiAnonShowScreen(learnMore)
      break
    }
    case 'terms': {
      const terms = TikiSdk.UI.Screen.Terms.create(
        {
          src: TikiSdk.config()._offers[0]._terms
        },
        async () => {
          tikiSetDecisionCookie()
          terms.remove()
        },
        () => {
          terms.remove()
          tikiAnonGoTo('prompt')
        },
        TikiSdk.config().activeTheme
      )
      tikiAnonShowScreen(terms)
      break
    }
  }
}

const tikiAnonShowScreen = (screen) => {
  const div = document.getElementById(tikiId)
  if (div != null) {
    div.appendChild(screen)
  }
}

const tikiAnonCreateOverlay = () => {
  const overlay = TikiSdk.UI.Element.Overlay.create(() => tikiAnonGoTo('none'))
  overlay.id = tikiOverlayId
  return overlay
}

window.addEventListener('load', (event) => {
  const customerId = tikiGetCustomerId()
  console.log(customerId)
  if (customerId) {
    TikiSdk.config()
      .theme
      .primaryTextColor(TIKI_SETTINGS.primaryTextColor)
      .secondaryTextColor(TIKI_SETTINGS.secondaryTextColor)
      .primaryBackgroundColor(TIKI_SETTINGS.primaryBackgroundColor)
      .secondaryBackgroundColor(TIKI_SETTINGS.secondaryBackgroundColor)
      .accentColor(TIKI_SETTINGS.accentColor)
      .fontFamily(TIKI_SETTINGS.fontFamily)
      .and()
      .offer
      .ptr(customerId)
      .description(TIKI_SETTINGS.description)
      .reward(TIKI_SETTINGS.offerImage)
      .bullet({ text: TIKI_SETTINGS.useCase1, isUsed: TIKI_SETTINGS.isUsed1 })
      .bullet({ text: TIKI_SETTINGS.useCase2, isUsed: TIKI_SETTINGS.isUsed2 })
      .bullet({ text: TIKI_SETTINGS.useCase3, isUsed: TIKI_SETTINGS.isUsed3 })
      .terms(TIKI_SETTINGS.terms)
      .tag(TikiSdk.Trail.Title.TitleTag.deviceId())
      .use({ usecases: [TikiSdk.Trail.License.LicenseUsecase.attribution()] })
      .add()
      .initialize(TIKI_SETTINGS.publishingId,
        async () => {
          const tikiDecisionCookie = document.cookie.match(/(?:^|;\s*)tiki_decision=([^;]*)/)
          if (tikiDecisionCookie) {
            const offer = TikiSdk._offers[0]
            const uses = tikiDecisionCookie === true ? offer._uses : []
            const license = await TikiSdk.Trail.License.create(
              offer._ptr,
              uses,
              offer._terms,
              offer._tags,
              offer._description,
              offer._expiry
            )
            
          } else {
            TikiSdk.present()
          }
        })
  } else {
    if (!Shopify.designMode || TIKI_SETTINGS.preview === 'true') {
      TikiSdk.config()
        .theme
        .primaryTextColor(TIKI_SETTINGS.primaryTextColor)
        .secondaryTextColor(TIKI_SETTINGS.secondaryTextColor)
        .primaryBackgroundColor(TIKI_SETTINGS.primaryBackgroundColor)
        .secondaryBackgroundColor(TIKI_SETTINGS.secondaryBackgroundColor)
        .accentColor(TIKI_SETTINGS.accentColor)
        .fontFamily(TIKI_SETTINGS.fontFamily)
        .and().offer
        .ptr(customerId)
        .description(TIKI_SETTINGS.description)
        .reward(TIKI_SETTINGS.offerImage)
        .bullet({ text: TIKI_SETTINGS.useCase1, isUsed: TIKI_SETTINGS.isUsed1 })
        .bullet({ text: TIKI_SETTINGS.useCase2, isUsed: TIKI_SETTINGS.isUsed2 })
        .bullet({ text: TIKI_SETTINGS.useCase3, isUsed: TIKI_SETTINGS.isUsed3 })
        .terms(TIKI_SETTINGS.terms)
        .tag(TikiSdk.Trail.Title.TitleTag.deviceId())
        .use({ usecases: [TikiSdk.Trail.License.LicenseUsecase.attribution()] })
        .add()
      tikiAnon()
    }
  }
})
