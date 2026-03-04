import Contacts

private let privateContactsDirectory = "PrivateContacts"

extension CNContact {
  private static let storageQueue = DispatchQueue(label: "com.app.privateContactsStorage")

  func storePrivate(asNew: Bool = true) throws {
    try Self.storageQueue.sync {
      var contact: CNMutableContact
      if asNew {
        contact = CNMutableContact()
        contact.contactType = self.contactType
        contact.namePrefix = self.namePrefix
        contact.givenName = self.givenName
        contact.middleName = self.middleName
        contact.familyName = self.familyName
        contact.previousFamilyName = self.previousFamilyName
        contact.nameSuffix = self.nameSuffix
        contact.nickname = self.nickname
        contact.phoneticGivenName = self.phoneticGivenName
        contact.phoneticMiddleName = self.phoneticMiddleName
        contact.phoneticFamilyName = self.phoneticFamilyName
        contact.jobTitle = self.jobTitle
        contact.departmentName = self.departmentName
        contact.organizationName = self.organizationName
        contact.phoneticOrganizationName = self.phoneticOrganizationName
        contact.postalAddresses = self.postalAddresses
        contact.emailAddresses = self.emailAddresses
        contact.urlAddresses = self.urlAddresses
        contact.phoneNumbers = self.phoneNumbers
        contact.socialProfiles = self.socialProfiles
        contact.dates = self.dates
        contact.nonGregorianBirthday = self.nonGregorianBirthday
        contact.birthday = self.birthday
        // contact.note = self.note
        contact.imageData = self.imageData
        contact.contactRelations = self.contactRelations
        contact.instantMessageAddresses = self.instantMessageAddresses
      } else {
        contact = self.mutableCopy() as! CNMutableContact
      }

      let fileManager = FileManager.default
      let documentsDirectory = try fileManager.url(
        for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
      let contactsDirectory = documentsDirectory.appendingPathComponent(
        privateContactsDirectory, isDirectory: true)
      try fileManager.createDirectory(at: contactsDirectory, withIntermediateDirectories: true)
      let fileURL = contactsDirectory.appendingPathComponent("\(contact.identifier).contact")

      if fileManager.fileExists(atPath: fileURL.path) {
        try fileManager.removeItem(at: fileURL)
      }

      let data = try NSKeyedArchiver.archivedData(
        withRootObject: contact, requiringSecureCoding: true)
      try data.write(to: fileURL)
    }
  }

  static func getPrivate() throws -> [CNContact] {
    try Self.storageQueue.sync {
      let fileManager = FileManager.default
      let documentsDirectory = try fileManager.url(
        for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
      let contactsDirectory = documentsDirectory.appendingPathComponent(
        privateContactsDirectory, isDirectory: true)

      guard fileManager.fileExists(atPath: contactsDirectory.path) else {
        return []
      }

      let fileURLs = try fileManager.contentsOfDirectory(
        at: contactsDirectory, includingPropertiesForKeys: nil)
      var contacts: [CNContact] = []

      for fileURL in fileURLs {
        if let data = try? Data(contentsOf: fileURL),
          let contact = try? NSKeyedUnarchiver.unarchivedObject(ofClass: CNContact.self, from: data)
        {
          contacts.append(contact)
        }
      }

      return contacts
    }
  }

  static func getPrivate(identifier: String) throws -> CNContact? {
    try storageQueue.sync {
      let fileManager = FileManager.default
      let documentsDirectory = try fileManager.url(
        for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
      let contactsDirectory = documentsDirectory.appendingPathComponent(
        privateContactsDirectory, isDirectory: true)
      let fileURL = contactsDirectory.appendingPathComponent("\(identifier).contact")

      guard fileManager.fileExists(atPath: fileURL.path) else {
        return nil
      }

      let data = try Data(contentsOf: fileURL)
      return try NSKeyedUnarchiver.unarchivedObject(ofClass: CNContact.self, from: data)
    }
  }

  static func deletePrivate(identifier: String) throws {
    try storageQueue.sync {
      let fileManager = FileManager.default
      let documentsDirectory = try fileManager.url(
        for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
      let contactsDirectory = documentsDirectory.appendingPathComponent(
        privateContactsDirectory, isDirectory: true)
      let fileURL = contactsDirectory.appendingPathComponent("\(identifier).contact")

      if fileManager.fileExists(atPath: fileURL.path) {
        try fileManager.removeItem(at: fileURL)
      }
    }
  }

}
