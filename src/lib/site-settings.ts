import { NAV_ITEMS, NavItem } from '@/config/navigation'
import { SiteSetting } from '@/payload-types'
import config from '@/payload.config'
import { getPayload } from 'payload'

export async function getVisibleNavItems(): Promise<NavItem[]> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: 'site-settings',
    }) as SiteSetting

    // Filter navigation items based on settings
    return NAV_ITEMS.map(item => {
      if (!item.dropdown) {
        // Handle top-level items (like Tagfelvétel)
        if (item.href === '/tagfelvetel' && !settings.showRecruitmentPage) {
          return null
        }
        return item
      }

      // Handle dropdown items
      const filteredDropdown = item.dropdown.filter(dropdownItem => {
        if (dropdownItem.href === '/egyesulet' && !settings.showAssociationPage) {
          return false
        }
        if (dropdownItem.href === '/tagfelvetel' && !settings.showRecruitmentPage) {
          return false
        }
        return true
      })

      // If dropdown becomes empty, hide the entire parent
      if (filteredDropdown.length === 0) {
        return null
      }

      return {
        ...item,
        dropdown: filteredDropdown,
      }
    }).filter((item): item is NavItem => item !== null)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    // Return full navigation on error to avoid breaking the site
    return NAV_ITEMS
  }
}

export async function isPageVisible(pagePath: string): Promise<boolean> {
  try {
    const payload = await getPayload({ config })
    const settings = await payload.findGlobal({
      slug: 'site-settings',
    }) as SiteSetting

    switch (pagePath) {
      case '/egyesulet':
        return settings.showAssociationPage ?? true
      case '/tagfelvetel':
        return settings.showRecruitmentPage ?? true
      default:
        return true
    }
  } catch (error) {
    console.error('Error checking page visibility:', error)
    return true // Show page on error
  }
}
