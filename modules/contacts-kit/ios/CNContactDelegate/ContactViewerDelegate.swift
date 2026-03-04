import Contacts
import ContactsUI
import ExpoModulesCore

class ContactViewerDelegate: NSObject, CNContactViewControllerDelegate {
  private var promise: Promise
  private var store: CNContactStore
  private var onContactWasUpdated: () -> Void
  private var viewControllerType: ViewControllerType

  init(
    promise: Promise, store: CNContactStore, type: ViewControllerType,
    onContactWasUpdated: @escaping () -> Void = {}
  ) {
    self.promise = promise
    self.store = store
    self.onContactWasUpdated = onContactWasUpdated
    self.viewControllerType = type
    super.init()
  }

  func contactViewController(
    _ viewController: CNContactViewController, didCompleteWith contact: CNContact?
  ) {
    switch viewControllerType {
    case .privateContact:
      handleDidComplete(private: contact)
    case .contact:
      handleDidComplete(contact: contact)
    }
    viewController.dismiss(animated: true)
  }

  private func handleDidComplete(private contact: CNContact?) {
    if let contact = contact {
      do {
        try contact.storePrivate(asNew: true)
        let request = CNSaveRequest()
        request.delete(contact.mutableCopy() as! CNMutableContact)
        try self.store.execute(request)
        try CNContact.deletePrivate(identifier: contact.identifier)
        onContactWasUpdated()

        promise.resolve(contact.toDictionary())
      } catch {
        promise.reject(
          Exception(
            name: "ContactStoreError",
            description: "Failed to store contact privately: \(error.localizedDescription)"))
        return
      }
    } else {
      promise.resolve(nil)
    }
  }

  private func handleDidComplete(contact: CNContact?) {
    if let contact = contact {
      do {
        let request = CNSaveRequest()
        if let mutableContact = contact.mutableCopy() as? CNMutableContact {
          request.update(mutableContact)
          try self.store.execute(request)
          onContactWasUpdated()
        }
        promise.resolve(contact.toDictionary())
      } catch {
        promise.reject(
          Exception(
            name: "ContactUpdateError",
            description: "Failed to update contact: \(error.localizedDescription)"))
        return
      }
    } else {
      promise.resolve(nil)
    }
  }

}

enum ViewControllerType {
  case contact
  case privateContact
}
